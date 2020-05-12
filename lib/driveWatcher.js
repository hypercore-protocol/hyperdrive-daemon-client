const { EventEmitter } = require('events')
const low = require('last-one-wins')
const pump = require('pump')
const streamx = require('streamx')

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

module.exports = DriveWatcher
