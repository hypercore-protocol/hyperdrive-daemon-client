const fs = require('fs').promises
const p = require('path')

const cliProgress = require('cli-progress')
const mirrorFolder = require('mirror-folder')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')
const { HyperdriveClient } = require('../..')

const IMPORT_KEY_FILE_PATH = '.hyperdrive-import-key'
const EXPORT_KEY_FILE_PATH = '.hyperdrive-export-key'

class ImportCommand extends DaemonCommand {
  static usage = 'import [dir] [key]'
  static description = 'Continuously import a directory into a Hyperdrive.'
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

  async run () {
    const { args, flags } = this.parse(ImportCommand)
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
      format: `Importing | {bar} | {percentage}% | {value}/{total} Files`
    })
    console.log(`Importing ${args.dir} into ${drive.key.toString('hex')} (Ctrl+c to exit)...`)
    console.log()

    const localMirror = mirrorFolder(args.dir, { fs: drive, name: '/' }, {
      watch: true,
      dereference: true,
      keepExisting: true,
      ignore: (file, stat, cb) => {
        if (shouldIgnore(file)) return process.nextTick(cb, null, true)
        return process.nextTick(cb, null, false)
      }
    })
    localMirror.on('pending', ({ name }) => {
      if (shouldIgnore(name)) return
      progress.setTotal(++total)
    })
    localMirror.on('put', () => {
      progress.update(++uploaded)
    })
    localMirror.on('del', () => {
      progress.update(++uploaded)
    })
    localMirror.on('skip', (src, dst) => {
      if (src && (shouldIgnore(src.name) || src.name === '/')) return
      if (dst && (shouldIgnore(dst.name) || dst.name === '/')) return
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

    async function loadKeyFromFile () {
      const keyPath = p.join(args.dir, IMPORT_KEY_FILE_PATH)
      try {
        const key = await fs.readFile(keyPath)
        return key
      } catch (err) {
        if (err && err.code !== 'ENOENT') throw err
        return null
      }
    }

    function saveKeyToFile () {
      const keyPath = p.join(args.dir, IMPORT_KEY_FILE_PATH)
      return fs.writeFile(keyPath, drive.key)
    }

    function shouldIgnore (name) {
      if (!name) return true
      if (name.indexOf(EXPORT_KEY_FILE_PATH) !== -1) return true
      else if (name.indexOf(IMPORT_KEY_FILE_PATH) !== -1) return true
      return false
    }
  }
}

module.exports = ImportCommand
