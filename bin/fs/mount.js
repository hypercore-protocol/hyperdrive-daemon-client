const p = require('path')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')

const ROOT_DRIVE_PATH = p.resolve('/hyperdrive')

exports.command = 'mount [mnt]'
exports.desc = 'Mount a Hyperdrive the specified mountpoint, or /hyperdrive if this is the root drive.'
exports.builder = {
  sparse: {
    description: 'Create sparse content feeds.',
    type: 'boolean',
    default: true
  },
  sparseMetadata: {
    description: 'Create a sparse metadata feed.',
    type: 'boolean',
    default: true
  },
  seed: {
    description: 'Make the drive available to the network',
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
    const mnt = argv.mnt ? p.posix.resolve(argv.mnt) : ROOT_DRIVE_PATH
    client.fuse.mount(mnt, {
      sparse: argv.sparse,
      sparseMetadata: argv.sparseMetadata,
      seed: argv.seed
    }, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(rsp.path, rsp.mountInfo.key)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not mount the drive:'))
    console.error(chalk.red(`${err.details}`))
  }

  function onsuccess (mnt, key) {
    console.log(chalk.green('Mounted a drive:'))
    console.log()
    console.log(chalk.green(`  Key:        ${key.toString('hex')} `))
    console.log(chalk.green(`  Mountpoint: ${mnt} `))
  }
}
