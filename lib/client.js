const grpc = require('@grpc/grpc-js')

const { daemon: api } = require('hyperdrive-daemon-api')
const { loadMetadata } = require('./metadata')

module.exports = async function getClients () {
  var endpoint = process.env['HYPERDRIVE_ENDPOINT']
  var token = process.env['HYPERDRIVE_TOKEN']

  if (!endpoint || !token) {
    const metadata = await loadMetadata()
    if (!metadata) {
      const err = new Error('Daemon metadata was not found.')
      err.disconnected = true
      throw err
    }
    endpoint = metadata.endpoint
    token = metadata.token
  }

  const clients = {
    hyperdrive: new rpc.main.services.HyperdriveDaemonClient(metadata.endpoint, grpc.credentials.createInsecure()),
    fuse: new rpc.fuse.services.HyperdriveFuseDaemonClient(metadata.endpoint, grpc.credentials.createInsecure())
  }
  return new Promise((resolve, reject) => {
    clients.hyperdrive.waitForReady(Date.now() + 250, err => {
      if (err) {
        err.disconnected = true
        return reject(err)
      }
      return resolve({ clients, metadata })
    })
  })
}
