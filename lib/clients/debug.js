const readline = require('readline')
const streamx = require('streamx')
const pump = require('pump')
const grpc = require('@grpc/grpc-js')

const { debug: { services, messages } } = require('../rpc')
const {
  toRPCMetadata: toMetadata
} = require('../common')

module.exports = class DebugClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new services.DebugClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  repl (opts = {}) {
    const stream = this._client.repl(toMetadata({ token: this.token }))
    const input = opts.input || process.stdin
    const output = opts.output || process.stdout
    if (input.isTTY) {
      input.setRawMode(true)
      readline.emitKeypressEvents(input)
      input.on('keypress', (chunk, key) => {
        if (key && key.ctrl && key.name === 'c') process.exit()
      })
    }
    const inputEncoder = new streamx.Transform({
      transform (chunk, cb) {
        const inputMessage = new messages.ReplMessage()
        inputMessage.setIo(chunk)
        return cb(null, inputMessage)
      }
    })
    const outputDecoder = new streamx.Transform({
      transform (rsp, cb) {
        return cb(null, rsp.getIo())
      }
    })
    pump(input, inputEncoder, stream, outputDecoder, output, err => {
      if (err) console.error(err)
    })
  }
}
