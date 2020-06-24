const { createMany: hsCreateMany } = require('hyperspace/test/helpers/create')

const HyperdriveClient = require('../..')

async function create (numServers, opts) {
  const { servers: daemons, clients, dirs, cleanup } = await hsCreateMany(numServers, opts)
  const driveClients = clients.map(c => {
    return new HyperdriveClient({ client: c })
  })
  return { hsClients: clients, clients: driveClients, daemons, cleanup, dirs }
}

async function createOne (opts) {
  const { dirs, clients, cleanup, daemons } = await create(1, opts)
  return {
    dir: dirs[0],
    client: clients[0],
    daemon: daemons[0],
    cleanup
  }
}

module.exports = {
  create,
  createOne
}
