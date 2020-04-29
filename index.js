const grpc = require('@grpc/grpc-js')
const maybe = require('call-me-maybe')
const { version: apiVersion } = require('hyperdrive-schemas')

const rpc = require('./lib/rpc')
const DriveClient = require('./lib/clients/drive')
const DebugClient = require('./lib/clients/debug')
const FuseClient = require('./lib/clients/fuse')
const PeersocketsClient = require('./lib/clients/peersockets')
const PeersClient = require('./lib/clients/peers')
const { main: { messages, services }} = rpc
const { toRPCMetadata: toMetadata } = require('./lib/common')
const { loadMetadata } = require('./lib/metadata')

class MainClient {
  constructor (endpoint, token, opts = {}) {
    if (typeof endpoint === 'object') {
      opts = endpoint
      endpoint = null
      token = null
    }
    this.endpoint = endpoint || opts.endpoint
    this.token = token || opts.token
    this.opts = opts

    // Set in this._ready
    this.fuse = null
    this.drive = null
    this.peersockets = null
    this.debug = null
    this.peers = null

    this._client = null
    this._readyOnce = null
    this.ready = (cb) => {
      if (!this._readyOnce) this._readyOnce = this._ready()
      return maybe(cb, this._readyOnce)
    }
  }

  async _ready () {
    const self = this

    if (!this.endpoint || !this.token) {
      try {
        const metadata = await loadMetadata(this.opts.storage)
        this.endpoint = this.endpoint || metadata.endpoint
        this.token = this.token || metadata.token
      } catch (err) {
        if (err) {
          err.disconnected = true
          throw err
        }
      }
    }

    this.drive = new DriveClient(this.endpoint, this.token)
    this.fuse = new FuseClient(this.drive, this.endpoint, this.token)
    this.peersockets = new PeersocketsClient(this.endpoint, this.token)
    this.debug = new DebugClient(this.endpoint, this.token)
    this.peers = new PeersClient(this.endpoint, this.token)

    this._client = new services.HyperdriveClient(this.endpoint, grpc.credentials.createInsecure())
    // TODO: Determine how long to wait for connection.
    return new Promise((resolve, reject) => {
      this._client.waitForReady(Date.now() + (this.opts.connectionTimeout || 500), err => {
        if (err) {
          err.disconnected = true
          return reject(err)
        }
        this.status((err, statusResponse) => {
          if (err) return reject(err)
          if (statusResponse.apiVersion !== apiVersion) {
            const versionMismatchError = new Error('The client\'s API version is not compabile with the server\'s API version.')
            versionMismatchError.versionMismatch = true
            return reject(versionMismatchError)
          }
          return resolve(this)
        })
      })
    })
  }

  status (cb) {
    const req = new messages.StatusRequest()
    return maybe(cb, new Promise((resolve, reject) => {
      this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve({
          apiVersion: rsp.getApiversion(),
          uptime: rsp.getUptime(),
          daemonVersion: rsp.getDaemonversion(),
          clientVersion: rsp.getClientversion(),
          schemaVersion: rsp.getSchemaversion(),
          hyperdriveVersion: rsp.getHyperdriveversion(),
          fuseNativeVersion: rsp.getFusenativeversion(),
          hyperdriveFuseVersion: rsp.getHyperdrivefuseversion(),
          holepunchable: rsp.getHolepunchable(),
          remoteAddress: rsp.getRemoteaddress(),
          fuseConfigured: rsp.getFuseconfigured(),
          fuseAvailable: rsp.getFuseavailable(),
          noiseKey: Buffer.from(rsp.getNoisekey())
        })
      })
    }))
  }

  close () {
    if (this.fuse) this.fuse.closeClient()
    if (this.drive) this.drive.closeClient()
    if (this.peersockets) this.peersockets.closeClient()
    if (this.debug) this.debug.closeClient()
    if (this.peers) this.peers.closeClient()
  }
}

module.exports = {
  HyperdriveClient: MainClient,
  rpc,
  loadMetadata,
  apiVersion
}
