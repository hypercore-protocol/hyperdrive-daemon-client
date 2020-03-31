const p = require('path').posix
const ora = require('ora')

const DaemonCommand = require('../../lib/cli')

class UnseedCommand extends DaemonCommand {
  static usage = 'unseed ~/Hyperdrive/my/drive'
  static description = 'Stop seeding a Hyperdrive.'
  static args = [
    DaemonCommand.drivePathArg({
      required: false,
      description: 'The path to the drive that should be unseeded.',
      default: process.cwd()
    })
  ]
  static flags = {
    key: DaemonCommand.keyFlag({
      description: 'The drive key to seed (will override the provided path)'
    })
  }

  async run () {
    const self = this
    const { flags, args } = this.parse(UnseedCommand)
    await super.run()

    const spinner = ora('Leaving the network (this might take some time to unnanounce)')
    spinner.start()

    const config = {
      lookup: false,
      announce: false,
      remember: true
    }

    if (flags.key) {
      try {
        const drive = await this.client.drive.get({ key: flags.key })
        await drive.configureNetwork(config)
        await drive.close()
        return onsuccess(null, true)
      } catch (err) {
        return onerror(err)
      }
    } else {
      try {
        await this.client.fuse.configureNetwork(args.path, config)
        return onsuccess(args.path, false)
      } catch (err) {
        return onerror(err)
      }
    }
    this.exit()

    function onerror (err) {
      spinner.fail('Could not unseed the drive:')
      console.error(`${err.details || err}`)
      self.exit(1)
    }

    function onsuccess (mnt, isKey) {
      if (isKey) spinner.succeed(`Unseeded the drive with key ${flags.key.toString('hex')}`)
      else spinner.succeed(`Unseeded the drive mounted at ${args.path}`)
    }
  }
}

module.exports = UnseedCommand
