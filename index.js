const grpc = require('grpc')
const thunky = require('thunky')
const maybe = require('call-me-maybe')

const rpc = require('./lib/rpc.js')
const { loadMetadata } = require('./lib/metadata')
const {
  toHyperdriveOptions,
  fromHyperdriveOptions,
  toStat,
  fromStat,
  toMount,
  fromMount
} = require('./lib/common')

class MainClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token

    // Set in this._ready
    this.fuse = null
    this.drive = null
    this._client = null

    this._readyOnce = thunky(this._ready.bind(this))
    this.ready = (cb) => {
      return maybe(cb, new Promise((resolve, reject) => {
        this._readyOnce(err => {
          if (err) return reject(err)
          return resolve()
        })
      }))
    }
  }

  _ready (cb) {
    const self = this

    if (this.endpoint && this.token) return process.nextTick(onmetadata)
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
    const req = new rpc.main.messages.StatusRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this.ready(err => {
        if (err) return reject(err)
        this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
          if (err) return reject(err)
          return resolve(rsp)
        })
      })
    }))
  }

  stop (cb) {
    const req = new rpc.main.messages.StopRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this.ready(err => {
        if (err) return reject(err)
        this._client.stop(req, toMetadata({ token: this.token }), (err, rsp) => {
          if (err) return reject(err)
          // TODO: Response processing?
          return resolve(rsp)
        })
      })
    }))
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

  publish (mnt, cb) {
    const req = new rpc.fuse.messages.PublishRequest()

    req.setPath(mnt)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.publish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  unpublish (mnt, cb) {
    const req = new rpc.fuse.messages.UnpublishRequest()

    req.setPath(mnt)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unpublish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  unmount (cb) {
    const req = new rpc.fuse.messages.UnmountRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unmount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        // TODO: Response processing?
        return resolve()
      })
    }))
  }

  status (cb) {
    const req = new rpc.fuse.messages.FuseStatusRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.status(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve({
          available: rsp.getAvailable(),
          configured: rsp.getConfigured()
        })
      })
    }))
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

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.get(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve({
          opts: fromHyperdriveOptions(rsp.getOpts()),
          id: rsp.getId()
        })
      })
    }))
  }

  publish (id, cb) {
    const req = new rpc.drive.messages.PublishDriveRequest()

    req.setId(id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.publish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  unpublish (id, cb) {
    const req = new rpc.drive.messages.UnpublishDriveRequest()

    req.setId(id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unpublish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  readFile (id, path, cb) {
    const req = new rpc.drive.messages.ReadFileRequest()

    req.setId(id)
    req.setPath(path)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.readFile(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(Buffer.from(rsp.getContent()))
      })
    }))
  }

  writeFile (id, path, content, cb) {
    const req = new rpc.drive.messages.WriteFileRequest()
    if (!(content instanceof Buffer)) content = Buffer.from(content)

    req.setId(id)
    req.setPath(path)
    req.setContent(content)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.writeFile(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  stat (id, path, opts, cb) {
    if (typeof opts === 'function') return this.stat(id, path, {}, opts)
    const req = new rpc.drive.messages.StatRequest()
    opts = opts || {}

    req.setId(id)
    req.setPath(path)
    if (opts.lstat) req.setLstat(opts.lstat)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.stat(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(fromStat(rsp.getStat()))
      })
    }))
  }

  readdir (id, path, opts, cb) {
    if (typeof opts === 'function') return this.readdir(id, path, {}, opts)
    const req = new rpc.drive.messages.ReadDirectoryRequest()
    opts = opts || {}
    path = path || '/'

    req.setId(id)
    req.setPath(path)
    if (opts.recursive) req.setRecursive(opts.recursive)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.readdir(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(rsp.getFilesList())
      })
    }))
  }

  mount (id, path, opts, cb) {
    const req = new rpc.drive.messages.MountDriveRequest()
    path = path || '/'

    req.setId(id)
    req.setPath(path)
    req.setOpts(toMount(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.mount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  watch (id, path, cb) {

  }

  listen (id, watcher, cb) {

  }

  unwatch (id, watcher, cb) {

  }

  close (id, cb) {
    const req = new rpc.drive.messages.CloseSessionRequest()

    req.setId(id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.close(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
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
