const grpc = require('@grpc/grpc-js')
const maybe = require('call-me-maybe')

const { fuse: { services, messages } } = require('../rpc.js')
const {
  toHyperdriveOptions,
  fromHyperdriveOptions,
  toRPCMetadata: toMetadata
} = require('../common')

module.exports = class FuseClient {
  constructor (driveClient, endpoint, token) {
    this.driveClient = driveClient
    this.endpoint = endpoint
    this.token = token
    this._client = new services.FuseClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  mount (mnt, opts, cb) {
    const req = new messages.MountRequest()

    req.setPath(mnt)
    req.setOpts(toHyperdriveOptions(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.mount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve({
          path: rsp.getPath(),
          mountInfo: fromHyperdriveOptions(rsp.getMountinfo())
        })
      })
    }))
  }

  async configureNetwork (mnt, opts = {}, cb) {
    const self = this
    return maybe(cb, _configure())

    async function _configure () {
      const { key, path } = await self.info(mnt)
      const drive = await self.driveClient.get({ key })
      await drive.configureNetwork(opts)
      await drive.close()
    }
  }

  unmount (mnt, cb) {
    const req = new messages.UnmountRequest()

    req.setPath(mnt)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unmount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        // TODO: Response processing?
        return resolve()
      })
    }))
  }

  info (mnt, cb) {
    const req = new messages.InfoRequest()

    req.setPath(mnt)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.info(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve({
          key: rsp.getKey(),
          mountPath: rsp.getMountpath(),
          writable: rsp.getWritable(),
          path: rsp.getPath()
        })
      })
    }))
  }
}
