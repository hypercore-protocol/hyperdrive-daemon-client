const grpc = require('grpc')
const thunky = require('thunky')

const rpc = require('./lib/rpc.js')
const { loadMetadata } = require('./lib/metadata')
const {
  toHyperdriveOptions,
  fromHyperdriveOptions,
  toStat,
  fromStat
} = require('./lib/common')

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
      self.corestore = new CorestoreClient(self.endpoint, self.token)

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

  stop (cb) {
    this.ready(err => {
      if (err) return cb(err)
      const req = new rpc.main.messages.StopRequest()


      this._client.stop(req, toMetadata({ token: this.token }), (err, rsp) => {
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

  publish (mnt, cb) {
    const req = new rpc.fuse.messages.PublishRequest()

    req.setPath(mnt)

    this._client.publish(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null)
    })
  }

  unpublish (mnt, cb) {
    const req = new rpc.fuse.messages.UnpublishRequest()

    req.setPath(mnt)

    this._client.unpublish(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null)
    })
  }

  unmount (cb) {
    const req = new rpc.fuse.messages.UnmountRequest()

    this._client.unmount(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      // TODO: Response processing?
      return cb(null)
    })
  }

  status (cb) {
    const req = new rpc.fuse.messages.FuseStatusRequest()
    this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, {
        available: rsp.getAvailable(),
        configured: rsp.getConfigured()
      })
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

  get (opts, cb) {
    if (typeof opts === 'function') return this.get(null, opts)
    const req = new rpc.drive.messages.GetDriveRequest()

    req.setOpts(toHyperdriveOptions(opts))

    this._client.get(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, {
        opts: fromHyperdriveOptions(rsp.getOpts()),
        id: rsp.getId()
      })
    })
  }

  readFile (id, path, cb) {
    const req = new rpc.drive.messages.ReadFileRequest()

    req.setId(id)
    req.setPath(path)

    this._client.readFile(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, Buffer.from(rsp.getContent()))
    })
  }

  writeFile (id, path, content, cb) {
    const req = new rpc.drive.messages.WriteFileRequest()
    if (!(content instanceof Buffer)) content = Buffer.from(content)

    req.setId(id)
    req.setPath(path)
    req.setContent(content)

    this._client.writeFile(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null)
    })
  }

  stat (id, path, opts, cb) {
    if (typeof opts === 'function') return this.stat(id, path, {}, opts)
    const req = new rpc.drive.messages.StatRequest()

    req.setId(id)
    req.setPath(path)
    if (opts.lstat) req.setLstat(opts.lstat)

    this._client.stat(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, fromStat(rsp.getStat()))
    })
  }

  readdir (id, path, opts, cb) {
    if (typeof opts === 'function') return this.readdir(id, path, {}, opts)
    const req = new rpc.drive.messages.ReadDirectoryRequest()
    path = path || '/'

    req.setId(id)
    req.setPath(path)
    if (opts.recursive) req.setRecursive(opts.recursive)

    this._client.readdir(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null, rsp.getFilesList())
    })
  }

  watch (id, path, cb) {

  }

  listen (id, watcher, cb) {

  }

  unwatch (id, watcher, cb) {

  }

  closeSession (id, cb) {
    const req = new rpc.drive.messages.CloseSessionRequest()

    req.setId(id)

    this._client.closeSession(req, toMetadata({ token: this.token }), (err, rsp) => {
      if (err) return cb(err)
      return cb(null)
    })
  }
}

// TODO: implement
class CorestoreClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new rpc.corestore.services.CorestoreClient(this.endpoint, grpc.credentials.createInsecure())
  }
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
