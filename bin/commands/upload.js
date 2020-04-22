const fs = require('fs').promises
const p = require('path')

const cliProgress = require('cli-progress')
const mirrorFolder = require('mirror-folder')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')
const { HyperdriveClient } = require('../..')

const KEY_FILE_PATH = '.hyperdrive-key'

class UploadCommand extends DaemonCommand {
  static usage = 'upload [dir] [key]'
  static description = 'Continuously upload a directory into a Hyperdrive.'
  static args = [
    {
      name: 'dir',
      description: 'The directory you would like to upload to the drive.',
      default: process.cwd(),
      required: true,
      parse: dir => {
        return p.resolve(dir)
      }
    },
    DaemonCommand.keyArg({
      description: 'The drive key.',
      required: false
    })
  ]
  static flags = {
    'dry-run': flags.boolean({
      description: 'Emit all events but do not upload files.',
      default: false
    })
  }

  async run () {
    const { args, flags } = this.parse(UploadCommand)
    await super.run()
    var key = args.key
    var closed = false
    var total = 0
    var uploaded = 0

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)

    if (!key) key = await loadKeyFromFile()
    const drive = await this.client.drive.get({ key })
    if (!drive.writable) {
      console.error('The target drive is not writable!')
      return process.exit(1)
    }
    await saveKeyToFile()

    const progress = new cliProgress.SingleBar({
      format: `Uploading | {bar} | {percentage}% | {value}/{total} Files`
    })
    console.log(`Uploading ${args.dir} into ${drive.key.toString('hex')} (ctrl+c to exit)...`)
    console.log()

    const localMirror = mirrorFolder(args.dir, { fs: drive, name: '/' }, {
      watch: true,
      dereference: true,
      dryRun: flags['dry-run'],
      keepExisting: true
    })
    localMirror.on('pending', () => {
      progress.setTotal(++total)
    })
    localMirror.on('put', () => {
      progress.update(++uploaded)
    })
    localMirror.on('del', () => {
      progress.update(++uploaded)
    })
    localMirror.on('ignore', () => {
      progress.update(++uploaded)
    })
    localMirror.on('skip', () => {
      progress.update(++uploaded)
    })
    progress.start(1, 0)

    async function cleanup () {
      if (closed) return
      closed = true
      await drive.close()
      progress.stop()
      console.log('Exit signal received. Stopping upload...')
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

module.exports = UploadCommand
