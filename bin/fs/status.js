const chalk = require('chalk')

const getClients = require('../../lib/client')
const { loadMetadata } = require('../../lib/metadata')

exports.command = 'status'
exports.desc = 'Check FUSE status'
exports.handler = async function (argv) {
  try {
    var { clients, metadata } = await getClients()
  } catch (err) {
    console.log('err:', err)
    return console.error(chalk.red('The daemon is not running. Start it first with \`hyperdrive start\`.'))
  }

  clients.fuse.status(null, { token: metadata.token }, (err, rsp) => {
    console.log('ERR:', err, 'RSP:', rsp)
  })
}
