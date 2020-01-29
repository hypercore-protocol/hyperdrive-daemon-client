const chalk = require('chalk')

const loadClient = require('../lib/loader')

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

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
    console.log(chalk.green(`  Uptime:                  ${runningTime(rsp.uptime)}`))
    console.log()
    process.exit(0)
  }

  function runningTime (uptime) {
    const days = Math.floor(uptime / DAY)
    const hours = Math.floor((uptime - (days * DAY)) / HOUR)
    const minutes = Math.floor((uptime - (days * DAY) - (hours * HOUR)) / MINUTE)
    const seconds = Math.floor((uptime - (days * DAY) - (hours * HOUR) - (minutes * MINUTE)) / SECOND)
    return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
  }
}
