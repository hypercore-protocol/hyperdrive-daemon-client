const grpc = require('grpc')
const thunky = require('thunky')

const rpc = require('./lib/rpc.js')
const { loadMetadata } = require('./lib/metadata')
const { toHyperdriveOptions, fromHyperdriveOptions } = require('./lib/common')

class MainClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token

    // Set in this._ready
    this.fuse = null
    this.drive = null
    this._client = null

    this.ready = thunky(this._ready.bind(this))
  }

  _ready (cb) {
    const self = this

    if (this.client && this.token) return process.nextTick(onmetadata)
    return loadMetadata((err, metadata) => {
      if (err) {
        err.disconnected = true
        return cb(err)
      }
      this.endpoint = this.endpoint || metadata.endpoint
      this.token = this.token || metadata.token
      return onmetadata()
    })

    function onmetadata () {
      self.fuse = new FuseClient(self.endpoint, self.token)
      self.drive = new DriveClient(self.endpoint, self.token)
      self._client = new rpc.main.services.HyperdriveClient(self.endpoint, grpc.credentials.createInsecure())
      // TODO: Determine how long to wait for connection.
      self._client.waitForReady(Date.now() + 200, err => {
        if (err) {
          err.disconnected = true
          return cb(err)
        }
        return cb(null)
      })
    }
  }

  status (cb) {
    this.ready(err => {
      if (err) return cb(err)
      const req = new rpc.main.messages.StatusRequest()
      this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return cb(err)
        return cb(null, rsp)
      })
    })
  }

  stop () {
    this.ready(err => {
      if (err) return cb(err)
      const req = new rpc.main.messages.StopRequest()
      this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return cb(err)
        // TODO: Response processing?
        return cb(null, rsp)
      })
    })
  }
}

class FuseClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new rpc.fuse.services.FuseClient(this.endpoint, grpc.credentials.createInsecure())
  }

  mount (mnt, opts, cb) {
    const req = new rpc.fuse.messages.MountRequest()

    req.setPath(mnt)
    req.setOpts(toHyperdriveOptions(opts))

    this._client.mount(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, {
        path: rsp.getPath(),
        mountInfo: fromHyperdriveOptions(rsp.getMountinfo())
      })
    })
  }

  unmount () {
    const req = new rpc.fuse.messages.UnmountRequest()
    this._client.unmount(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      // TODO: Response processing?
      return cb(null)
    })
  }
}

// TODO: Implement
class DriveClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new rpc.drive.services.DriveClient(this.endpoint, grpc.credentials.createInsecure())
  }
}

// TODO: implement
class HypercoreClient {

}

function toMetadata (obj) {
  const metadata = new grpc.Metadata()
  for (let key of Object.getOwnPropertyNames(obj)) {
    metadata.set(key, obj[key])
  }
  return metadata
}

module.exports = {
  HyperdriveClient: MainClient,
  rpc,
  loadMetadata,
}
