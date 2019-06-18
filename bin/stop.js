const chalk = require('chalk')

const loadClient = require('../lib/loader')

exports.command = 'stop'
exports.desc = 'Stop the Hyperdrive daemon.'
exports.handler = async function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    client.stop(err => {
      if (err) return onerror(err)
      return onsuccess()
    })
  })

  function onerror (err) {
    if (err.disconnected) return console.error(chalk.red('The Hyperdrive daemon is not running.'))
    console.error(chalk.red(`Could not stop the daemon. Are you using any mountpoints?`))
  }

  function onsuccess () {
    console.log(chalk.green(`The Hyperdrive daemon has been stopped.`))
  }
}
