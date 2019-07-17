const p = require('path')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')

const ROOT_DRIVE_PATH = p.resolve('/hyperdrive')

exports.command = 'unpublish [mnt]'
exports.desc = 'Remove a mounted Hyperdrive available from the network.'
exports.builder = {}

exports.handler = function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    const mnt = argv.mnt ? p.posix.resolve(argv.mnt) : ROOT_DRIVE_PATH
    client.fuse.unpublish(mnt, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(mnt)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not unpublish the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt) {
    console.log(chalk.green(`Unpublished the drive mounted at ${mnt}`))
    process.exit(0)
  }
}
