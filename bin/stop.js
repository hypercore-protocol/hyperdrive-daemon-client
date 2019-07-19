const chalk = require('chalk')

const loadClient = require('../lib/loader')

exports.command = 'stop'
exports.desc = 'Stop the Hyperdrive daemon.'
exports.handler = async function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    client.stop(err => {
      if (err && err.code !== 13) return onerror(err)
      return onsuccess()
    })
  })

  function onerror (err) {
    if (err.disconnected) {
      console.error(chalk.red('The Hyperdrive daemon is not running.'))
    } else {
      console.error(chalk.red(`Could not stop the daemon. Are you using any mountpoints?`))
    }
    process.exit(1)
  }

  function onsuccess () {
    console.log(chalk.green(`The Hyperdrive daemon has been stopped.`))
    process.exit(0)
  }
}
