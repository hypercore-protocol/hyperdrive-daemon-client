const os = require('os')
const { execSync } = require('child_process')
const { Command } = require('@oclif/command')

const constants = require('../../lib/constants')

class ForceUnmountCommand extends Command {
  static usage = 'force-unmount'
  static description = 'Forcibly unmount the root filesystem (useful if it was not cleanly unmounted).'
  async run () {
    if (os.platform() === 'linux') {
      execSync(`sudo umount -l ${constants.hiddenMountpoint}`)
    } else if (os.platform() === 'darwin') {
      execSync(`sudo diskutil unmount ${constants.hiddenMountpoint}`)
    }
  }
}

module.exports = ForceUnmountCommand
