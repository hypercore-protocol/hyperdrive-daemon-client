const p = require('path')
const fs = require('fs').promises
const { flags } = require('@oclif/command')

const constants = require('../../lib/constants')
const DaemonCommand = require('../../lib/cli')

class StatsCommand extends DaemonCommand {
  static usage = 'stats [path]'
  static description = 'Get the networking stats for the drive mounted at a path.'
  static args = [
    DaemonCommand.drivePathArg({
      required: true,
      default: process.cwd()
    })
  ]
  static flags = {
    key: DaemonCommand.keyFlag({
      required: false,
      description: 'A drive key (will override the path argument)'
    }),
    root: flags.boolean({
      required: false,
      description: 'Display stats for your private root drive',
      default: false
    })
  }

  async run () {
    const { flags, args } = this.parse(StatsCommand)
    await super.run()
    console.log('args here:', args)

    var contents
    var key = flags.key && flags.key.toString('hex')
    try {
      if (!key) {
        ({ key } = await this.infoForPath(args.path))
      }
      contents = await fs.readFile(p.join(constants.mountpoint, 'Network', 'Stats', key, 'networking.json'), { encoding: 'utf8' })
      console.log(contents)
    } catch (err) {
      console.error('Could not get the drive stats:')
      console.error(`${err.details || err}`)
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = StatsCommand
