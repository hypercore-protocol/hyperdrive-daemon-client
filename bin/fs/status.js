const chalk = require('chalk')

const loadClient = require('../../lib/loader')

exports.command = 'status'
exports.desc = 'Check FUSE status'
exports.handler = async function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    client.fuse.status((err, { available, configured }) => {
      if (err) return onerror(err)
      return onsuccess(available, configured)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not get FUSE status: ${err.details}'))
  }

  function onsuccess (available, configured) {
    console.log(chalk.green('FUSE Status:'))
    console.log()
    console.log(chalk.green(`  Available: ${available}`))
    console.log(chalk.green(`  Configured: ${configured}`))
  }
}
