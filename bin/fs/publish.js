const p = require('path')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const constants = require('../../lib/constants')

exports.command = 'publish [mnt]'
exports.desc = 'Advertise a Hyperdrive to the network.'
exports.builder = {
  root: {
    description: 'Make your root drive (at ~/Hyperdrive) available to the network',
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
    const mnt = argv.mnt ? p.posix.resolve(argv.mnt) : constants.mountpoint
    if (mnt === constants.mountpoint && !argv.root) return onerror(new Error(`You must explicitly publish ${constants.mountpoint} with the --root flag`))
    if (!mnt.startsWith(constants.home)) return onerror(new Error(`You can only publish drives mounted underneath the root drive at ${constants.home}`))
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
