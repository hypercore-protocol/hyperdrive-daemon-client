const grpc = require('@grpc/grpc-js')
const maybe = require('call-me-maybe')

const { peers: { services, messages } } = require('../rpc')
const {
  toRPCMetadata: toMetadata
} = require('../common')
const WatchPeersTypes = messages.WatchPeersResponse.Type

module.exports = class PeersClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new services.PeersClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  listPeers (discoveryKey, cb) {
    if (typeof discoveryKey === 'string') discoveryKey = Buffer.from(discoveryKey, 'hex')
    const req = new messages.ListPeersRequest()
    if (discoveryKey) req.setDiscoverykey(discoveryKey)
    return maybe(cb, new Promise((resolve, reject) => {
      this._client.listPeers(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const rawPeers = rsp.getPeersList()
        return resolve(rawPeers.map(rawPeer => ({
          noiseKey: Buffer.from(rawPeer.getNoisekey()),
          address: rawPeer.getAddress(),
          type: rawPeer.getType()
        })))
      })
    }))
  }

  watchPeers (discoveryKey, opts = {}) {
    const req = new messages.WatchPeersRequest()
    if (discoveryKey) req.setDiscoverykey(discoveryKey)
    const stream = this._client.watchPeers(req, toMetadata({ token: this.token }))
    stream.on('data', msg => {
      const peers = msg.getPeersList()
      switch(msg.getType()) {
        case WatchPeersTypes.JOINED:
          if (opts.onjoin) {
            for (const peer of peers) {
              opts.onjoin(peer)
            }
          }
          break
        case WatchPeersTypes.LEFT:
          if (opts.onleave) {
            for (const peer of peers) {
              opts.onleave(peer)
            }
          }
          break
        default:
          throw new Error('Invalid message type received from server:' + msg.type)
      }
    })
    return () => stream.destroy()
  }

  getAlias (key, cb) {
    const req = new messages.GetAliasRequest()

    req.setKey(key)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.getAlias(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(rsp.getAlias())
      })
    }))
  }

  getKey (alias, cb) {
    const req = new messages.GetKeyRequest()

    req.setAlias(alias)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.getKey(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(Buffer.from(rsp.getKey()))
      })
    }))
  }
}
