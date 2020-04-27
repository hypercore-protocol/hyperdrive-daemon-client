const fs = require('fs').promises
const p = require('path')
const { EventEmitter } = require('events')

const cliProgress = require('cli-progress')
const mirrorFolder = require('mirror-folder')
const low = require('last-one-wins')
const streamx = require('streamx')
const pump = require('pump')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')
const { HyperdriveClient } = require('../..')

const KEY_FILE_PATH = '.hyperdrive-key'

class DriveWatcher extends EventEmitter {
  constructor (client, drive, opts = {}) {
    super()
    this.client = client
    this.drive = drive
    this.recursive = !!opts.recursive
    this.drivesByPath = new Map([[ '/', drive ]])
    this.versionsByPath = new Map()
    this.unwatchesByPath = new Map()
    this.watchers = []
    this.timer = null
    this.emittingStats = false
  }

  _createDiffer (path, drive) {
    // Last-one-wins in case the watch is triggered many times in quick succession.
    const self = this
    return low(onupdate)

    async function onupdate (_, cb) {
      const lastVersion = self.versionsByPath.get(path)
      try {
        const diffStream = await drive.createDiffStream(lastVersion)
        const currentVersion = await drive.version()
        self.versionsByPath.set(path, currentVersion)
        return pump(diffStream, new streamx.Transform({
          transform: (data, cb) => {
            for (const watcher of self.watchers) {
              watcher(p.join(path, data.name))
            }
            return cb(null)
          }
        }), err => {
          if (err) return cb(err)
          return cb(null)
        })
      } catch (err) {
        return cb(err)
      }
    }
  }

  async _emitStats () {
    if (this.emittingStats) return
    this.emittingStats = true
    var total = 0
    var downloaded = 0
    var peers = 0
    for (const [path, drive] of this.drivesByPath) {
      const driveStats = await drive.stats()
      for (const { path, metadata } of driveStats.stats) {
        if (path !== '/') continue
        downloaded += metadata.downloadedBlocks
        total += metadata.totalBlocks
        peers = metadata.peers
      }
    }
    this.emit('stats', { total, downloaded, peers })
    this.emittingStats = false
  }

  async start () {
    // TODO: Handle dynamic (un)mounting.
    this.versionsByPath.set('/', await this.drive.version())
    this.unwatchesByPath.set('/', this.drive.watch('/', this._createDiffer('/', this.drive)))
    const allMounts = await this.drive.mounts({ memory: false, recursive: this.recursive })
    for (const { path, opts } of allMounts) {
      if (path === '/') continue
      const childDrive = await this.client.drive.get({ key: opts.key })
      this.drivesByPath.set(path, childDrive)
      this.versionsByPath.set(path, opts.version)
      this.unwatchesByPath.set(path, childDrive.watch('/', this._createDiffer(path, childDrive)))
    }
    this.timer = setInterval(this._emitStats.bind(this), 1000)
  }

  watch (_, onwatch) {
    // The watch path is ignored for drives.
    this.watchers.push(onwatch)
    return () =>  {
      this.watchers.splice(this.watchers.indexOf(onwatch), 1)
    }
  }

  async close () {
    for (const [path, unwatch] of this.unwatchesByPath) {
      await unwatch()
    }
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

class DownloadCommand extends DaemonCommand {
  static usage = 'download [key] [dir]'
  static description = 'Continuously download a Hyperdrive into a directory.'
  static args = [
    DaemonCommand.keyArg({
      description: 'The drive key.',
      required: false
    }),
    {
      name: 'dir',
      description: 'The target directory to download into.',
      required: false,
      default: process.cwd(),
      parse: dir => {
        return p.resolve(dir)
      }
    }
  ]
  static flags = {
    recursive: flags.boolean({
      description: 'Recursively download drive mounts.',
      default: false
    })
  }

  async run () {
    const { args, flags } = this.parse(DownloadCommand)
    await super.run()
    var key = args.key
    var total = 0
    var downloaded = 0
    var closed = false

    if (!key) key = await loadKeyFromFile()
    const drive = await this.client.drive.get({ key })
    await saveKeyToFile()
    const driveWatcher = new DriveWatcher(this.client, drive, {
      recursive: flags.recursive
    })
    await driveWatcher.start()

    const progress = new cliProgress.SingleBar({
      format: `Downloaded | {bar} | {percentage}% | {value}/{total} Metadata Blocks | {peers} Peers`
    })
    console.log(`Downloading ${key.toString('hex')} into ${args.dir} (ctrl+c to exit)...`)
    console.log()
    progress.start(1, 0)
    driveWatcher.on('stats', stats => {
      progress.setTotal(stats.total)
      progress.update(stats.downloaded, { peers: stats.peers })
    })

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)

    const remoteMirror = mirrorFolder({ fs: drive, name: '/' }, args.dir, {
      watch: driveWatcher.watch.bind(driveWatcher),
      keepExisting: true,
      ensureParents: true
    })

    async function cleanup () {
      if (closed) return
      console.log('Exit signal received. Stopping download...')
      closed = true
      await driveWatcher.close()
      await drive.close()
      progress.stop()
      process.exit(0)
    }

    function loadKeyFromFile () {
      const keyPath = p.join(args.dir, KEY_FILE_PATH)
      try {
        const key = fs.readFile(keyPath)
        return key
      } catch (err) {
        if (err && err.code !== 'ENOENT') throw err
        return null
      }
    }

    function saveKeyToFile () {
      const keyPath = p.join(args.dir, KEY_FILE_PATH)
      return fs.writeFile(keyPath, drive.key)
    }
  }
}

module.exports = DownloadCommand
