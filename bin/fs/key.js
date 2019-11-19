const p = require('path').posix
const chalk = require('chalk')

const loadClient = require('../../lib/loader')

exports.command = 'key [mnt]'
exports.desc = 'Display the key for the drive mounted at the given mountpoint.'
exports.builder = {}

exports.handler = function (argv) {
  const mnt = p.resolve(argv.mnt)

  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    client.fuse.key(mnt, (err, key) => {
      if (err) return onerror(err)
      return onsuccess(key)
    })
  }

  function onerror (err) {
    console.error(chalk.red(`Could get the drive key for mountpoint: ${mnt}`))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (key) {
    console.log(chalk.green(key))
  }
}
