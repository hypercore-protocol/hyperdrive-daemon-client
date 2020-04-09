const { EventEmitter } = require('events')
const grpc = require('@grpc/grpc-js')

const { peersockets: { services, messages } } = require('../rpc')
const {
  toRPCMetadata: toMetadata
} = require('../common')
const PeerMessageTypes = messages.PeerMessage.Type

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
}

class PeersocketTopic extends EventEmitter {
  constructor (topicStream, topicName, handlers) {
    super()
    this.topic = topicName
    this.handlers = handlers
    this._topicStream = topicStream

    this._topicStream.on('close', () => this.emit('close'))
    this._topicStream.on('data', this._onmessage.bind(this))
    this._sendOpen()
  }

  _onmessage (msg) {
    switch (msg.getType()) {
      case PeerMessageTypes.DATA:
        if (!this.handlers.onmessage) break
        const dataMessage = msg.getData()
        const alias = dataMessage.getAlias()
        this.handlers.onmessage(alias, Buffer.from(dataMessage.getMsg()))
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

  send (alias, msg) {
    if (!this._topicStream) throw new Error('Topic handle is closed.')
    if (!Buffer.isBuffer(msg)) msg = Buffer.from(msg)
    const peerMessage = new messages.PeerMessage()
    const dataMessage = new messages.DataMessage()
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
