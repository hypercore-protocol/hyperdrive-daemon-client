const chalk = require('chalk')

const loadClient = require('../lib/loader')

exports.command = 'status'
exports.desc = 'Check the status of the Hyperdrive daemon.'
exports.handler = async function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    client.status(err => {
      if (err) return onerror(err)
      return onsuccess()
    })
  })

  function onerror (err) {
    if (err.disconnected) return console.error(chalk.red('The Hyperdrive daemon is not running.'))
    console.error(chalk.red(`Could not get the daemon status:`))
    console.error(chalk.red(`${err.details || err}`))
  }

  function onsuccess () {
    console.log(chalk.green(`The Hyperdrive daemon is running.`))
  }
}
