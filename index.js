const maybe = require('call-me-maybe')

const { NanoresourcePromise: Nanoresource } = require('nanoresource-promise/emitter')
const HyperspaceClient = require('hyperspace/client')

const DriveClient = require('./lib/clients/drive')
/*
const PeersClient = require('./lib/clients/peers')
const DebugClient = require('./lib/clients/debug')
const FuseClient = require('./lib/clients/fuse')
const PeersocketsClient = require('./lib/clients/peersockets')
*/

class HyperdriveClient extends Nanoresource {
  constructor (opts = {}) {
    super()
    this.opts = opts

    // Set in this._ready
    this.fuse = null
    this.peersockets = null
    this.debug = null

    this._client = opts.client || new HyperspaceClient({
      host: this.opts.host || this.opts.endpoint,
      ...this.opts
    })
    this.drive = new DriveClient(this._client)
  }

  async _open () {
    return this._client.ready()
    // this.fuse = new FuseClient(this._client)
    // this.peersockets = new PeersocketsClient(this._client)
    // this.debug = new DebugClient(this._client)
    // this.peers = new PeersClient(this._client)
  }

  _close () {
    return this._client.close()
  }

  status (cb) {
    // TODO: Add top-level status method to hyperspace.
    return process.nextTick(cb, null)
    return this._client.status(cb)
  }
}

module.exports = HyperdriveClient
