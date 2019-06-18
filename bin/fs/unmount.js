const chalk = require('chalk')

const loadClient = require('../../lib/loader')

exports.command = 'unmount'
exports.desc = 'Unmount the root drive.'
exports.builder = {}

exports.handler = function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    client.fuse.unmount(err => {
      if (err) return onerror(err)
      return onsuccess()
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not unmount the root drive:'))
    console.error()
    console.error(chalk.red(`${err.details}`))
  }

  function onsuccess (mnt, key) {
    console.log(chalk.green('Successfully unmounted the root drive.'))
  }
}
