const p = require('path').posix
const ora = require('ora')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')

class SeedCommand extends DaemonCommand {
  static usage = 'seed [path]'
  static description = 'Seed a Hyperdrive on the network.'
  static args = [
    DaemonCommand.drivePathArg({
      required: false
    })
  ]
  static flags = {
    key: DaemonCommand.keyFlag({
      description: 'The drive key to seed (will override the provided path)'
    }),
    root: flags.boolean({
      description: 'Make your root drive (at ~/Hyperdrive) available to the network',
      default: false
    }),
    announce: flags.boolean({
      description: 'Announce that you\'re seeding the drive to the DHT',
      default: true
    }),
    lookup: flags.boolean({
      description: 'Lookup drive seeders on the DHT',
      default: true
    }),
    remember: flags.boolean({
      description: 'Save this drive\'s networking configuration across restarts',
      default: true
    })
  }

  async run () {
    const self = this
    const { flags, args } = this.parse(SeedCommand)
    await super.run()

    const spinner = ora('Joining the network (might take a while to announce)...')
    spinner.start()

    const config = {
      lookup: flags.lookup,
      announce: flags.announce,
      remember: flags.remember
    }

    if (flags.key) {
      try {
        const drive = await this.client.drive.get({ key: flags.key })
        await drive.configureNetwork(config)
        await drive.close()
        onsuccess(null, true)
      } catch (err) {
        return onerror(err)
      }
    } else {
      try {
        await this.client.fuse.configureNetwork(args.path, config)
        onsuccess(args.path, false)
      } catch (err) {
        return onerror(err)
      }
    }
    this.exit()

    function onerror (err) {
      spinner.fail('Could not seed the drive:')
      console.error(`${err.details || err}`)
      self.exit(1)
    }

    function onsuccess (mnt, isKey) {
      if (isKey) spinner.succeed(`Seeding the drive with key ${flags.key.toString('hex')}`)
      else spinner.succeed(`Seeding the drive mounted at ${args.path}`)
    }
  }
}

module.exports = SeedCommand
