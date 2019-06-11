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
    client.ready(onready)
  })

  function onready (err) {
    if (err) return onerror(err)
    client.fuse.mount(argv.mnt, {
      sparse: argv.sparse,
      sparseMetadata: argv.sparseMetadata,
      seed: argv.seed
    }, (err, { mnt, mountInfo }) => {
      if (err) return onerror(err)
      return onsuccess(mnt, mountInfo)
    })
  }

  function onerror (err) {
    console.error(chalk.red(`Could not mount the root Hyperdrive: ${err}`))
  }

  function onsuccess (mnt, mountInfo) {
    console.log(chalk.green(`Mounted root hyperdrive with key ${mountInfo.key.toString('hex')} at ${mnt}`))
  }
}
