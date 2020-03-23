const p = require('path')
const chalk = require('chalk')
const ora = require('ora')

const loadClient = require('../lib/loader')
const { normalize, infoForPath } = require('../lib/cli')
const constants = require('../lib/constants')

exports.command = 'seed [path]'
exports.desc = 'Seed a Hyperdrive on the network.'
exports.builder = {
  root: {
    description: 'Make your root drive (at ~/Hyperdrive) available to the network',
    type: 'boolean',
    default: false
  },
  announce: {
    description: 'Announce that you\'re seeding the drive to the DHT',
    type: 'boolean',
    default: true
  },
  lookup: {
    description: 'Lookup drive seeders on the DHT',
    type: 'boolean',
    default: true
  },
  remember: {
    description: 'Save this drive\'s networking configuration across restarts',
    type: 'boolean',
    default: true
  }
}

exports.handler = function (argv) {
  let mnt = argv.path || process.cwd()
  var spinner = ora(chalk.blue('Joining the network (might take a while to announce)...'))
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    try {
      mnt = normalize(mnt)
    } catch (err) {
      return onerror(err)
    }
    spinner.start()
    infoForPath(client, mnt, argv.root, (err, info, isRoot) => {
      if (err) return onerror(err)
      client.fuse.configureNetwork(mnt, {
        lookup: argv.lookup,
        announce: argv.announce,
        remember: argv.remember
      }, (err, rsp) => {
        if (err) return onerror(err)
        return onsuccess(mnt, isRoot)
      })
    })
  }

  function onerror (err) {
    spinner.fail(chalk.red('Could not seed the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt) {
    spinner.succeed(chalk.green(`Seeding the drive mounted at ${mnt}`))
    process.exit(0)
  }
}
