const p = require('path').posix
const { flags } = require('@oclif/command')

const DaemonCommand = require('../../lib/cli')

class InfoCommand extends DaemonCommand {
  static usage = 'info [path]'
  static description = 'Display information about the drive mounted at the given mountpoint.'
  static args = [
    DaemonCommand.drivePathArg({
      required: true
    })
  ]
  static flags = {
    root: flags.boolean({
      description: 'Show info about your private root drive',
      default: false
    })
  }

  async run () {
    const { args, flags } = this.parse(InfoCommand)
    await super.run()
    try {
      const info = await this.infoForPath(args.path, args.root)
      const isMount = !info.mountPath
      const parentMount = !isMount ? args.path.slice(0, args.path.length - info.mountPath.length) : ''
      const parentInfo = !isMount ? `(the parent mount is ${parentMount})` : ''
      console.log('Drive Info:')
      console.log()
      console.log(`  Key:          ${info.key}`)
      console.log(`  Is Mount:     ${isMount} ${parentInfo}`)
      console.log(`  Writable:     ${info.writable}`)
      if (info.root) console.log('\nThis is info about your root drive. You probably should not share this.')
    } catch (err) {
      console.error(`Could get info for mountpoint: ${args.path}`)
      console.error(`${err.details || err}`)
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = InfoCommand
