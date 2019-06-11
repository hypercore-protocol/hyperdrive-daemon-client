const p = require('path')
const chalk = require('chalk')

const { HyperdriveClient } = require('../..')
const { loadMetadata } = require('../../lib/metadata')

exports.command = 'mount <mnt>'
exports.desc = 'Mount the root Hyperdrive the specified mountpoint.'
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
    description: 'Make the private hyperdrive available to the network',
    type: 'boolean',
    default: false
  }
}
exports.handler = function (argv) {
  loadMetadata((err, metadata) => {
    if (err) return onerror(err)
    const client = new HyperdriveClient(metadata.endpoint, metadata.token)
    client.ready(err => {
      if (err) return onerror(err)
      return onclient(client)
    })
  })

  function onclient (client) {
    client.fuse.mount(p.resolve(argv.mnt), {
      sparse: argv.sparse,
      sparseMetadata: argv.sparseMetadata,
      seed: argv.seed
    }, (err, { path, mountInfo }) => {
      if (err) return onerror(err)
      return onsuccess(path, mountInfo.key)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not mount the root Hyperdrive.'))
    console.error(chalk.red(`${err.details}`))
  }

  function onsuccess (mnt, key) {
    console.log(chalk.green('Mounted root hyperdrive:'))
    console.log(chalk.green(`  Key:        ${key.toString('hex')} `))
    console.log(chalk.green(`  Mountpoint: ${mnt} `))
  }
}
