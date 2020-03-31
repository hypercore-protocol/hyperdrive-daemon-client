const p = require('path')
const ora = require('ora')
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')

class CreateCommand extends DaemonCommand {
  static usage = 'create [path]'
  static description = 'Create a new drive mounted at the specified path'
  static args = [
    DaemonCommand.drivePathArg({
      required: false,
      description: 'The path to the location in ~/Hyperdrive where your new drive will be created'
    })
  ]
  static flags = {
    'no-seed': flags.boolean({
      description: 'Do not seed the new drive on the Hyperdrive network',
      default: false
    })
  }

  async run () {
    const { flags, args } = this.parse(CreateCommand)
    await super.run()
    const spinner = ora('Creating your new drive (if seeding, this might take a while to announce)...')
    try {
      const { path, mountInfo } = await this.client.fuse.mount(args.path, { seed: !flags['no-seed'] })
      const seeding = !!mountInfo.seed

      spinner.succeed('Created a drive with the following info:')
      console.log()
      console.log(`  Path: ${path} `)
      console.log(`  Key:  ${mountInfo.key.toString('hex')} `)
      if (mountInfo.version) console.log(`  Version:    ${mountInfo.version}`)
      console.log(`  Seeding: ${seeding}`)
      if (!seeding) {
        console.log()
        console.log(`This drive is private by default. To publish it, run \`hyperdrive seed ${args.path}\``)
      }
    } catch (err) {
      spinner.fail('Could not create the drive:')
      console.error(`${err.details || err}`)
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = CreateCommand
