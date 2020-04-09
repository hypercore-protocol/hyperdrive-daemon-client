const { EventEmitter } = require('events')
const grpc = require('@grpc/grpc-js')

const { peersockets: { services, messages } } = require('../rpc')
const {
  toRPCMetadata: toMetadata
} = require('../common')
const WatchPeersTypes = messages.WatchPeersResponse.Type
const PeerMessageTypes = messages.PeerMessage.Type

const ALIAS = Symbol('peersockets-alias')

module.exports = class PeersocketsClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new services.PeersocketsClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  join (topicName, handlers = {}) {
    if (!topicName) throw new Error('A topic name must be specified.')
    if (typeof topicName !== 'string') throw new Error('The topic name must be a string.')
    const stream = this._client.join(toMetadata({ token: this.token }))
    return new PeersocketTopic(stream, topicName, handlers)
  }

  watchPeers (discoveryKey, opts = {}) {
    const req = new messages.WatchPeersRequest()
    if (discoveryKey) req.setDiscoverykey(discoveryKey)
    const stream = this._client.watchPeers(req, toMetadata({ token: this.token }))
    stream.on('data', msg => {
      const peers = msg.getPeersList().map(p => {
        return {
          noiseKey: Buffer.from(p.getNoisekey()),
          address: p.getAddress()
        }
      })
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
}

class PeersocketTopic extends EventEmitter {
  constructor (topicStream, topicName, handlers) {
    super()
    this.topic = topicName
    this.handlers = handlers
    this._topicStream = topicStream
    this._serverAliases = new Map()
    this._aliasCount = 0

    this._topicStream.on('close', () => this.emit('close'))
    this._topicStream.on('data', this._onmessage.bind(this))
    this._sendOpen()
  }

  _onmessage (msg) {
    switch (msg.getType()) {
      case PeerMessageTypes.ALIAS:
        const aliasMessage = msg.getAlias()
        this._serverAliases.set(aliasMessage.getAlias(), Buffer.from(aliasMessage.getNoisekey()))
        break
      case PeerMessageTypes.DATA:
        if (!this.handlers.onmessage) break
        const dataMessage = msg.getData()
        const noiseKey = this._serverAliases.get(dataMessage.getAlias())
        // Ignore messages that weren't preceded by an Alias message.
        if (!noiseKey) break
        this.handlers.onmessage(noiseKey, Buffer.from(dataMessage.getMsg()))
        break
      default:
        throw new Error('Invalid message type received from server:' + msg.getType())
    }
  }

  _sendOpen () {
    const peerMessage = new messages.PeerMessage()
    const openMessage = new messages.OpenMessage()
    openMessage.setTopic(this.topic)
    peerMessage.setType(PeerMessageTypes.OPEN)
    peerMessage.setOpen(openMessage)
    this._topicStream.write(peerMessage)
  }

  _createAlias (remoteKey) {
    const peerMessage = new messages.PeerMessage()
    const aliasMessage = new messages.AliasMessage()
    // The aliases always incrementing -- not a problem given small (relatively) peer counts.
    const alias = ++this._aliasCount
    remoteKey[ALIAS] = alias
    peerMessage.setType(PeerMessageTypes.ALIAS)
    aliasMessage.setAlias(alias)
    aliasMessage.setNoisekey(remoteKey)
    peerMessage.setAlias(aliasMessage)
    this._topicStream.write(peerMessage)
    return alias
  }

  send (remoteKey, msg) {
    if (!this._topicStream) throw new Error('Topic handle is closed.')
    if (!Buffer.isBuffer(msg)) msg = Buffer.from(msg)
    const peerMessage = new messages.PeerMessage()
    const dataMessage = new messages.DataMessage()
    const alias = remoteKey[ALIAS] || this._createAlias(remoteKey)
    peerMessage.setType(PeerMessageTypes.DATA)
    dataMessage.setAlias(alias)
    dataMessage.setMsg(msg)
    peerMessage.setData(dataMessage)
    this._topicStream.write(peerMessage)
  }

  close () {
    if (this._topicStream) {
      this._topicStream.destroy()
      this._topicStream = null
    }
  }
}
