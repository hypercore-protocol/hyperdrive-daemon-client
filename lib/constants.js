const p = require('path')
const os = require('os')

const DAEMON_ROOT = p.join(os.homedir(), '.hyperdrive')
const MOUNTPOINT = p.join(os.homedir(), 'Hyperdrive')
const HOMEDIR = p.join(MOUNTPOINT, 'home')

module.exports = {
  uid: 'hyperdrive',
  processName: 'hyperdrive',
  port: 3101,
  logLevel: 'info',
  heapSize: 4096,
  bootstrap: [],
  mountpoint: MOUNTPOINT,
  networkPath: p.join(MOUNTPOINT, 'Network'),
  home: HOMEDIR,

  root: DAEMON_ROOT,
  storage: p.join(DAEMON_ROOT, 'storage'),
  metadata: p.join(DAEMON_ROOT, 'config.json'),
  unstructuredLog: p.join(DAEMON_ROOT, 'output.log'),
  structuredLog: p.join(DAEMON_ROOT, 'log.json'),

  env: {
    endpoint: process.env.HYPERDRIVE_ENDPOINT,
    token: process.env.HYPERDRIVE_TOKEN,
    storage: process.env.HYPERDRIVE_STORAGE
  }
}
