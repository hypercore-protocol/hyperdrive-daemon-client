const p = require('path')
const ora = require('ora')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')

class MountCommand extends DaemonCommand {
  static usage = 'mount [path] [key]'
  static description = `Mount a drive at the specified mountpoint underneath the root.`
  static args = [
    DaemonCommand.drivePathArg({
      required: true,
      description: 'The path where the drive will be mounted (must be within ~/Hyperdrive)'
    }),
    DaemonCommand.keyArg({
      description: 'The key of the drive that will be mounted (a new drive will be created if blank)'
    })
  ]
  static flags = {
    version: flags.integer({
      description: 'Mount a static checkout of the drive at a specific version.',
      required: false
    }),
    seed: flags.boolean({
      description: 'Seed the new drive on the Hyperdrive network (false by default for mounts)',
      required: false,
      default: false
    })
  }

  async run () {
    const { flags, args } = this.parse(MountCommand)
    await super.run()
    const spinner = ora('Mounting your drive (if seeding, this might take a while to announce)...')
    try {
      const { path, mountInfo } = await this.client.fuse.mount(args.path, {
        key: args.key ? args.key : null,
        version: flags.version,
      })

      const drive = await this.client.drive.get({ key: mountInfo.key })
      if (flags.seed) await drive.configureNetwork({ announce: true, lookup: true, remember: true})
      const { network } = await drive.stats({ networkingOnly: true })
      await drive.close()

      const seeding = network.announce

      spinner.succeed('Mounted a drive with the following info:')
      console.log()
      console.log(`  Path: ${path} `)
      console.log(`  Key:  ${mountInfo.key.toString('hex')} `)
      if (mountInfo.version) console.log(`  Version:    ${mountInfo.version}`)
      console.log(`  Seeding: ${seeding}`)
      if (!seeding) {
        console.log()
        console.log(`This drive is private by default. To publish it, run \`hyperdrive seed ${path}\``)
      }
    } catch (err) {
      spinner.fail('Could not mount the drive:')
      console.error(`${err.details || err}`)
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = MountCommand
