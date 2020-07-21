const { NanoresourcePromise: Nanoresource } = require('nanoresource-promise/emitter')
const HyperspaceClient = require('hyperspace/client')
const Peersockets = require('peersockets')

const DriveClient = require('./lib/clients/drive')
const PeersClient = require('./lib/clients/peers')

class HyperdriveClient extends Nanoresource {
  constructor (opts = {}) {
    super()
    this.opts = opts

    this._client = opts.client || new HyperspaceClient({
      host: this.opts.host || this.opts.endpoint,
      ...this.opts
    })

    this.drive = new DriveClient(this._client)
    this.peersockets = new Peersockets(this._client.network)
    this.peers = new PeersClient(this._client)
  }

  ready (cb) {
    return this.open(cb)
  }

  _open () {
    return this._client.ready()
  }

  _close () {
    return this._client.close()
  }

  status (cb) {
    return this._client.status(cb)
  }
}

module.exports = HyperdriveClient
