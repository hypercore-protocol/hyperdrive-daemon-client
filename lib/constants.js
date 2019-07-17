const p = require('path')
const os = require('os')

const DAEMON_ROOT = p.join(os.homedir(), '.hyperdrive')

module.exports = {
  uid: 'hyperdrive',
  port: 3101,
  logLevel: 'debug',
  bootstrap: [],
  mountpoint: '/hyperdrive',

  root: DAEMON_ROOT,
  storage: p.join(DAEMON_ROOT, 'storage'),
  metadata: p.join(DAEMON_ROOT, 'config.json'),
  unstructuredLog: p.join(DAEMON_ROOT, 'output.log'),
  structuredLog: p.join(DAEMON_ROOT, 'log.json'),

  env: {
    endpoint: process.env['HYPERDRIVE_ENDPOINT'],
    token: process.env['HYPERDRIVE_TOKEN']
  }
}
