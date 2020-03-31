const p = require('path').posix
const chalk = require('chalk')

const DaemonCommand = require('../../lib/cli')

class UnmountCommand extends DaemonCommand {
  static usage = 'unmount [path]'
  static description = 'Unmount a drive. The root drive will be unmounted if a mountpoint is not specified.'
  static args = [
    DaemonCommand.drivePathArg({
      description: 'The path to the drive to unmount (must be within ~/Hyperdrive)',
      required: true
    })
  ]

  async run () {
    const { args } = this.parse(UnmountCommand)
    await super.run()

    try {
      await this.client.fuse.unmount(args.path)
      console.log('Successfully unmounted the drive.')
    } catch (err) {
      console.error('Could not unmount the drive:')
      console.error(`${err.details || err}`)
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = UnmountCommand
