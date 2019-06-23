const os = require('os')
const { execSync } = require('child_process')

const chalk = require('chalk')

exports.command = 'force-unmount'
exports.desc = 'Forcibly unmount the root filesystem (useful if it was not cleanly unmounted).'
exports.handler = function (argv) {
  if (os.platform() === 'linux') {
    execSync('sudo umount -l /hyperdrive')
  } else if (os.platform() === 'darwin') {
    execSync('sudo diskutil unmount /hyperdrive')
  }
}
