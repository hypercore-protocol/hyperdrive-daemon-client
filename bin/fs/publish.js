const p = require('path')
const chalk = require('chalk')
const datEncoding = require('dat-encoding')

const loadClient = require('../../lib/loader')

const ROOT_DRIVE_PATH = p.resolve('/hyperdrive')

exports.command = 'publish [mnt]'
exports.desc = 'Make a mounted Hyperdrive available to the network.'
exports.builder = {
  root: {
    description: 'Make your root drive (at /hyperdrive) available to the network',
    type: 'boolean',
    default: false
  }
}

exports.handler = function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    const mnt = argv.mnt ? p.posix.resolve(argv.mnt) : ROOT_DRIVE_PATH
    if (mnt === ROOT_DRIVE_PATH && !argv.root) return onerror(new Error('You must explicitly publish /hyperdrive with the --root flag'))
    client.fuse.publish(mnt, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(mnt)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not publish the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt) {
    console.log(chalk.green(`Published the drive mounted at ${mnt}`))
    process.exit(0)
  }
}
