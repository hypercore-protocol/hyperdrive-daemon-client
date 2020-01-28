const chalk = require('chalk')

const loadClient = require('../lib/loader')

exports.command = 'status'
exports.desc = 'Check the status of the Hyperdrive daemon.'
exports.handler = async function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    client.status((err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(rsp)
    })
  })

  function onerror (err) {
    if (err.disconnected) {
      console.error(chalk.red('The Hyperdrive daemon is not running.'))
    } else {
      console.error(chalk.red(`Could not get the daemon status:`))
      console.error(chalk.red(`${err.details || err}`))
    }
    process.exit(1)
  }

  function onsuccess (rsp) {
    console.log(chalk.green(`The Hyperdrive daemon is running:`))
    console.log()
    console.log(chalk.green(`  API Version:             ${rsp.apiVersion}`))
    console.log(chalk.green(`  Daemon Version:          ${rsp.daemonVersion}`))
    console.log(chalk.green(`  Client Version:          ${rsp.clientVersion}`))
    console.log(chalk.green(`  Schema Version:          ${rsp.schemaVersion}`))
    console.log(chalk.green(`  Hyperdrive Version:      ${rsp.hyperdriveVersion}`))
    console.log(chalk.green(`  Fuse Native Version:     ${rsp.fuseNativeVersion}`))
    console.log(chalk.green(`  Hyperdrive Fuse Version: ${rsp.hyperdriveFuseVersion}`))
    console.log()
    process.exit(0)
  }
}
