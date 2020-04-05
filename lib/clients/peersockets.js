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
    const req = messages.WatchPeersRequest()
    if (discoveryKey) req.setDiscoverykey(discoveryKey)
    const stream = this._client.watchPeers(discoveryKey, toMetadata({ token: this.token }))
    stream.on('data', msg => {
      const peers = msg.getPeersList().map(p => {
        return {
          noiseKey: p.getNoisekey(),
          host: p.getHost()
        }
      })
      switch(msg.type) {
      case WatchPeersTypes.Joined:
        if (opts.onjoin) opts.onjoin(peers)
        break
      case WatchPeersTypes.Left:
        if (opts.onleave) opts.onleave(peers)
        break
      default:
        throw new Error('Invalid message type received from server:' + msg.type)
      }
    })
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
    switch (msg.type) {
    case PeerMessageTypes.Alias:
      const aliasMessage = msg.getAlias()
      this._serverAliases.set(aliasMessage.getAlias(), aliasMessage.getNoisekey())
      break
    case PeerMessageTypes.Data:
      if (this.handlers.onmessage) break
      const dataMessage = msg.getData()
      const noiseKey = this._serverAliases.get(dataMessage.getAlias())
      // Ignore messages that weren't preceded by an Alias message.
      if (!noiseKey) break
      this.handlers.onmessage(noiseKey, dataMessage.getMsg())
    default:
      throw new Error('Invalid message type received from server:' + msg.type)
    }
  }

  _sendOpen () {
    const peerMessage = new messages.PeerMessage()
    const openMessage = new messages.OpenMessage()
    openMessage.setTopic(this.topic)
    peerMessage.setType(PeerMessageTypes.Open)
    openMessage.setOpen(openMessage)
    this._topicStream.write(peerMessage)
  }

  _createAlias (remoteKey) {
    const peerMessage = new messages.PeerMessage()
    const aliasMessage = new messages.AliasMessage()
    // The aliases always incrementing -- not a problem given small (relatively) peer counts.
    const alias = ++this._aliasCount
    peerMessage.setType(PeerMessageTypes.Alias)
    aliasMessage.setAlias(alias)
    aliasMessage.setNoisekey(remoteKey)
    peerMessage.setAlias(aliasMessage)
    this._topicStream.write(peerMessage)
    return alias
  }

  send (remoteKey, msg) {
    const peerMessage = new messages.PeerMessage()
    const dataMessage = new messages.AliasMessage()
    const alias = remoteKey[ALIAS] || this._createAlias(remoteKey)
    peerMessage.setType(PeerMessageTypes.Data)
    dataMessage.setAlias(alias)
    dataMessage.setMsg(msg)
    peerMessage.setData(dataMessage)
    this._topicStream.write(peerMessage)
  }
}
