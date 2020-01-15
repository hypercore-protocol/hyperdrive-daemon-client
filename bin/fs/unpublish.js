const p = require('path')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const { normalize } = require('../../lib/paths')
const constants = require('../../lib/constants')

exports.command = 'unpublish [mnt]'
exports.desc = 'Stop advertising a mounted drive.'
exports.builder = {}

exports.handler = function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    try {
      var mnt = normalize(argv.mnt)
    } catch (err) {
      return onerror(err)
    }
    if (!mnt.startsWith(constants.mountpoint)) return onerror(new Error(`You can only unpublish drives mounted underneath the root drive at ${constants.mountpoint}`))
    client.fuse.configureNetwork(mnt, {
      lookup: false,
      announce: false,
      remember: true
    }, (err, rsp) => {
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
