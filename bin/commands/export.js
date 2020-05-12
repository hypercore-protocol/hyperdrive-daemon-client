const fs = require('fs').promises
const p = require('path')

const cliProgress = require('cli-progress')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')
const { HyperdriveClient } = require('../..')

const { exportKeyFilePath: KEY_FILE_PATH } = require('../../lib/constants')

class ExportCommand extends DaemonCommand {
  static usage = 'export [key] [dir]'
  static description = 'Continuously export a Hyperdrive into a directory.'
  static args = [
    DaemonCommand.keyArg({
      description: 'The drive key.',
      required: false
    }),
    {
      name: 'dir',
      description: 'The target directory to export into.',
      required: false,
      parse: dir => {
        if (!dir) return null
        return p.resolve(dir)
      }
    }
  ]
  static flags = {
    recursive: flags.boolean({
      description: 'Recursively export drive mounts.',
      default: false
    })
  }

  async run () {
    const { args, flags } = this.parse(ExportCommand)
    await super.run()
    var key = args.key
    var dir = args.dir

    var total = 0
    var downloaded = 0
    var closed = false

    var loadedKey = false
    if (!dir) {
      // If the directory was not specified, we're in one of two cases:
      // 1) We're in a directory that we previously downloaded into, in which case reuse that key.
      // 2) This is a new download, in which case create a new target dir.
      dir = process.cwd()
      const savedKey = await loadKeyFromFile()
      if (savedKey) {
        loadedKey = true
        key = key || savedKey
      } else {
        if (!key) throw new Error('If you are not resuming a previous download, a key must be specified.')
        dir = p.join(dir, key.toString('hex'))
      }
    }

    const drive = await this.client.drive.get({ key })
    if (!loadedKey) await saveKeyToFile()

    const progress = new cliProgress.SingleBar({
      format: `Exporting | {bar} | {percentage}% | {value}/{total} Content Blocks | {peers} Peers`
    })
    console.log(`Exporting ${key.toString('hex')} into ${dir} (Ctrl+c to exit)...`)
    console.log()
    progress.start(1, 0)

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)

    const driveWatcher = this.client.drive.export(drive, dir, {recursive: flags.recursive})

    await driveWatcher.start()

    driveWatcher.on('stats', stats => {
      progress.setTotal(stats.total)
      progress.update(stats.downloaded, { peers: stats.peers })
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

    async function loadKeyFromFile () {
      const keyPath = p.join(dir, KEY_FILE_PATH)
      try {
        const key = await fs.readFile(keyPath)
        return key
      } catch (err) {
        if (err && err.code !== 'ENOENT') throw err
        return null
      }
    }

    async function saveKeyToFile () {
      const keyPath = p.join(dir, KEY_FILE_PATH)
      await fs.mkdir(dir, { recursive: true })
      return fs.writeFile(keyPath, drive.key)
    }
  }
}

module.exports = ExportCommand
