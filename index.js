const { EventEmitter } = require('events')
const grpc = require('@grpc/grpc-js')
const thunky = require('thunky')
const collectStream = require('stream-collector')
const pump = require('pump')
const pumpify = require('pumpify')
const map = require('through2-map')
const maybe = require('call-me-maybe')
const codecs = require('codecs')

const { Writable } = require('@mafintosh/streamx')
const { Stat } = require('hyperdrive-schemas')

const rpc = require('./lib/rpc.js')
const { loadMetadata } = require('./lib/metadata')
const {
  toHyperdriveOptions,
  fromHyperdriveOptions,
  toStat,
  fromStat,
  toMount,
  toChunks,
  fromDiffEntry,
  fromDriveStats,
  fromDownloadProgress
} = require('./lib/common')

class MainClient {
  constructor (endpoint, token, opts = {}) {
    this.endpoint = endpoint
    this.token = token
    this.opts = opts

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
      self._client.waitForReady(Date.now() + (self.opts.connectionTimeout || 500), err => {
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

  close () {
    if (this.fuse) this.fuse.closeClient()
    if (this.drive) this.drive.closeClient()
  }
}

class FuseClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new rpc.fuse.services.FuseClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
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

  unmount (mnt, cb) {
    const req = new rpc.fuse.messages.UnmountRequest()

    req.setPath(mnt)

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

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  get (opts, cb) {
    if (typeof opts === 'function') return this.get(null, opts)
    const req = new rpc.drive.messages.GetDriveRequest()

    req.setOpts(toHyperdriveOptions(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.get(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const drive = new RemoteHyperdrive(this, this._client, this.token, rsp.getId(), fromHyperdriveOptions(rsp.getOpts()))
        return resolve(drive)
      })
    }))
  }

  allStats (cb) {
    const req = new rpc.drive.messages.StatsRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.allStats(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const statsList = rsp.getStatsList().map(stat => fromDriveStats(stat))
        return resolve(statsList)
      })
    }))
  }
}

class RemoteHyperdrive {
  constructor (drives, client, token, id, opts) {
    this._client = client
    this._drives = drives
    this.token = token
    this.id = id
    this.opts = opts

    this.key = opts.key
    this.hash = opts.hash
    this.writable = opts.writable
  }

  version (cb) {
    const req = new rpc.drive.messages.DriveVersionRequest()

    req.setId(this.id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.version(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(rsp.getVersion())
      })
    }))
  }

  checkout (version) {
    return this._drives.get({
      ...this.opts,
      version,
      writable: false
    })
  }

  publish (cb) {
    const req = new rpc.drive.messages.PublishDriveRequest()

    req.setId(this.id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.publish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  unpublish (cb) {
    const req = new rpc.drive.messages.UnpublishDriveRequest()

    req.setId(this.id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unpublish(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  stats (cb) {
    const req = new rpc.drive.messages.DriveStatsRequest()

    req.setId(this.id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.stats(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const stats = fromDriveStats(rsp.getStats())
        return resolve(stats)
      })
    }))
  }

  download (path, opts) {
    const req = new rpc.drive.messages.DownloadRequest()

    if (path) req.setPath(path)
    const detailed = opts && opts.detailed
    req.setDetailed(detailed)

    var downloadId = null

    const dl = new EventEmitter()
    Object.assign(dl, {
      cancel: (cb) => {
        if (!downloadId) return cb(new Error('Cancel must be called after the download event has been received.'))
        return this.undownload(downloadId, cb)
      }
    })

    const call = this._client.download(req, toMetadata({ token: this.token }))
    pump(
      call,
      map.obj(handleDownloadResponse),
      err => {
        if (err) dl.emit('error', err)
      }
    )

    return dl

    function handleDownloadResponse (rsp) {
      const type = rsp.getType()
      const id = rsp.getDownloadid()
      if (id && !downloadId) downloadId = id

      var event = fromDownloadRsp(rsp)

      switch (type) {
        case rpc.drive.messages.DownloadResponse.Type.START:
          dl.emit('start', event)
          break

        case rpc.drive.messages.DownloadResponse.Type.PROGRESS:
          dl.emit('progress', event)
          break

        case rpc.drive.messages.DownloadResponse.Type.FINISH:
          if (rsp.getCancelled()) {
            dl.emit('cancel', event)
          } else {
            dl.emit('finish', event)
          }
          break

        default:
          dl.emit('error', new Error(`Unknown download response type: ${type}`))
          break
      }
    }

    function fromDownloadRsp (rsp) {
      const event = {}
      event.totals = fromDownloadProgress(rsp.getProgress())
      if (detailed) {
        const fileMap = new Map()
        const files = rsp.getFilesList()
        for (const fileRsp of files) {
          fileMap.set(fileRsp.getPath(), fromDownloadProgress(fileRsp.getProgress()))
        }
        event.files = fileMap
      }
    }
  }

  undownload (downloadId, cb) {
    const req = new rpc.drive.messages.UndownloadRequest()

    req.setId(this.id)
    req.setDownloadid(downloadId)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.undownload(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  async createDiffStream (other, prefix) {
    if (typeof other === 'string') {
      return this.createDiffStream(0, other)
    } else if (typeof other === 'object') {
      const version = await other.version()
      return this.createDiffStream(version, prefix)
    }
    if (other === undefined) other = 0

    const req = new rpc.drive.messages.DiffStreamRequest()
    req.setId(this.id)
    req.setOther(other)
    if (prefix) req.setPrefix(prefix)

    const call = this._client.createDiffStream(req, toMetadata({ token: this.token }))
    return pumpify.obj(
      call,
      map.obj(rsp => {
        return {
          type: rsp.getType(),
          name: rsp.getName(),
          value: fromDiffEntry(rsp.getValue())
        }
      })
    )
  }

  createReadStream (path, opts = {}) {
    const req = new rpc.drive.messages.ReadStreamRequest()

    req.setId(this.id)
    req.setPath(path)
    if (opts.start) req.setStart(opts.start)
    if (opts.length) req.setLength(opts.length)
    if (opts.end) req.setEnd(opts.end)

    const call = this._client.createReadStream(req, toMetadata({ token: this.token }))
    return pumpify(
      call,
      map.obj(rsp => Buffer.from(rsp.getChunk()))
    )
  }

  readFile (path, opts = {}, cb) {
    if (typeof opts === 'function') return this.readFile(path, null, opts)

    const req = new rpc.drive.messages.ReadFileRequest()
    req.setId(this.id)
    req.setPath(path)
    var codec = null

    if (opts.encoding) {
      codec = typeof opts.encoding === 'object' ? opts.encoding: codecs(opts.encoding)
    }

    return maybe(cb, new Promise((resolve, reject) => {
      const call = this._client.readFile(req, toMetadata({ token: this.token }))
      collectStream(call, (err, rsps) => {
        if (err) return reject(err)
        const bufs = rsps.map(rsp => Buffer.from(rsp.getChunk()))
        var decoded = Buffer.concat(bufs)
        if (codec) {
          try {
            decoded = codec.decode(decoded)
          } catch (err) {
            return reject(err)
          }
        }
        return resolve(decoded)
      })
    }))
  }

  createWriteStream (path, opts = {}) {
    const req = new rpc.drive.messages.WriteStreamRequest()

    req.setId(this.id)
    req.setPath(path)
    req.setOpts(toStat(opts))

    var flushed = false
    var callback = null

    const call = this._client.createWriteStream(toMetadata({ token: this.token }), err => {
      if (err && stream && !stream.destroyed) return stream.destroy(err)
      flushed = true
      if (callback) callback(null)
    })
    call.write(req)

    const stream = new Writable({
      write: (data, cb) => {
        return call.write(data, cb)
      },

      final: (cb) => {
        call.end()
        if (flushed) return process.nextTick(cb, null)
        callback = cb
        return null
      },

      map: chunk => {
        const req = new rpc.drive.messages.WriteStreamRequest()
        req.setChunk(Buffer.from(chunk))
        return req
      }
    })

    return stream
  }

  writeFile (path, content, opts = {}, cb) {
    if (typeof opts === 'function') return this.writeFile(path, content, null, opts)
    if (!(content instanceof Buffer)) content = Buffer.from(content)

    const req = new rpc.drive.messages.WriteFileRequest()
    req.setId(this.id)
    req.setPath(path)

    return maybe(cb, new Promise((resolve, reject) => {
      const call = this._client.writeFile(toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
      call.write(req)

      const chunks = toChunks(content)

      for (const chunk of chunks) {
        const req = new rpc.drive.messages.WriteFileRequest()
        req.setChunk(chunk)
        call.write(req)
      }
      call.end()
    }))
  }

  stat (path, opts, cb) {
    if (typeof opts === 'function') return this.stat(path, {}, opts)
    const req = new rpc.drive.messages.StatRequest()
    opts = opts || {}

    req.setId(this.id)
    req.setPath(path)
    if (opts.lstat) req.setLstat(opts.lstat)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.stat(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const rawStat = fromStat(rsp.getStat())
        return resolve(new Stat(rawStat))
      })
    }))
  }

  lstat (path, opts, cb) {
    if (typeof opts === 'function') return this.lstat(path, {}, opts)
    const req = new rpc.drive.messages.StatRequest()
    opts = opts || {}

    req.setId(this.id)
    req.setPath(path)
    req.setLstat(true)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.stat(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const rawStat = fromStat(rsp.getStat())
        return resolve(new Stat(rawStat))
      })
    }))
  }

  unlink (path, cb) {
    const req = new rpc.drive.messages.UnlinkRequest()

    req.setId(this.id)
    req.setPath(path)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unlink(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err && err.errno !== 2) return reject(err)
        return resolve()
      })
    }))
  }

  mkdir (path, opts, cb) {
    if (typeof opts === 'function') return this.mkdir(path, {}, opts)
    const req = new rpc.drive.messages.MkdirRequest()
    opts = opts || {}

    req.setId(this.id)
    req.setPath(path)
    req.setOpts(toStat(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.mkdir(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  rmdir (path, cb) {
    const req = new rpc.drive.messages.RmdirRequest()

    req.setId(this.id)
    req.setPath(path)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.rmdir(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  readdir (path, opts, cb) {
    if (typeof opts === 'function') return this.readdir(path, {}, opts)
    const req = new rpc.drive.messages.ReadDirectoryRequest()
    opts = opts || {}
    path = path || '/'

    req.setId(this.id)
    req.setPath(path)
    if (opts.recursive) req.setRecursive(opts.recursive)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.readdir(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve(rsp.getFilesList())
      })
    }))
  }

  mount (path, opts, cb) {
    const req = new rpc.drive.messages.MountDriveRequest()
    path = path || '/'

    const mountInfo = new rpc.drive.messages.MountInfo()
    mountInfo.setPath(path)
    mountInfo.setOpts(toMount(opts))

    req.setId(this.id)
    req.setInfo(mountInfo)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.mount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  unmount (path, cb) {
    const req = new rpc.drive.messages.UnmountDriveRequest()
    path = path || '/'

    req.setId(this.id)
    req.setPath(path)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.unmount(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  watch (path, cb) {
    const req = new rpc.drive.messages.WatchRequest()

    req.setId(this.id)
    req.setPath(path)

    const call = this._client.watch(toMetadata({ token: this.token }))
    call.write(req)

    call.on('data', () => cb())

    return function (cb) {
      return maybe(cb, new Promise(resolve => {
        const req = new rpc.drive.messages.WatchRequest()
        call.write(req)
        return resolve()
      }))
    }
  }

  symlink (target, linkname, cb) {
    const req = new rpc.drive.messages.SymlinkRequest()

    req.setId(this.id)
    req.setTarget(target)
    req.setLinkname(linkname)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.symlink(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  close (cb) {
    const req = new rpc.drive.messages.CloseSessionRequest()

    req.setId(this.id)

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
  loadMetadata
}
