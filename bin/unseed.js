const p = require('path')
const chalk = require('chalk')
const ora = require('ora')

const loadClient = require('../lib/loader')
const { normalize } = require('../lib/cli')
const constants = require('../lib/constants')

exports.command = 'unseed [path]'
exports.desc = 'Stop seeding a Hyperdrive.'
exports.builder = {}

exports.handler = function (argv) {
  var spinner = ora(chalk.blue('Leaving the network (this might take some time to unnanounce)'))
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    try {
      var mnt = normalize(argv.path)
    } catch (err) {
      return onerror(err)
    }
    if (!mnt.startsWith(constants.mountpoint)) return onerror(new Error(`You can only unseed drives mounted underneath the root drive at ${constants.mountpoint}`))
    spinner.start()
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
    spinner.fail(chalk.red('Could not unseed the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt) {
    spinner.succeed(chalk.green(`Unseeded the drive mounted at ${mnt}`))
    process.exit(0)
  }
}
