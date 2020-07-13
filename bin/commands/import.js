const fs = require('fs').promises
const p = require('path')

const cliProgress = require('cli-progress')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')

const {
  importKeyFilePath: IMPORT_KEY_FILE_PATH,
  exportKeyFilePath: EXPORT_KEY_FILE_PATH
} = require('../../lib/constants')

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
  static flags = {
    'no-seed': flags.boolean({
      description: 'Do not seed the new drive on the Hyperdrive network',
      default: false
    })
  }

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
    if (!flags['no-seed']) {
      await drive.configureNetwork({ lookup: true, announce: true, remember: true })
    }
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

    const localMirror = this.client.drive.import(args.dir, drive)

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


  }
}

module.exports = ImportCommand
