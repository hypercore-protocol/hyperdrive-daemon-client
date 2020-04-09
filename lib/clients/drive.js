const grpc = require('@grpc/grpc-js')
const maybe = require('call-me-maybe')
const collectStream = require('stream-collector')
const pumpify = require('pumpify')
const map = require('through2-map')
const codecs = require('codecs')
const { Writable } = require('streamx')

const { Stat } = require('hyperdrive-schemas')
const { drive: { services,messages } } = require('../rpc.js')
const {
  toHyperdriveOptions,
  fromHyperdriveOptions,
  toStat,
  fromStat,
  toMount,
  fromMount,
  toChunks,
  toNetworkConfiguration,
  fromDiffEntry,
  fromDriveStats,
  fromDownloadProgress,
  fromFileStats,
  fromNetworkConfiguration,
  setMetadata,
  fromMetadata,
  fromDriveInfo,
  toRPCMetadata: toMetadata
} = require('../common')

module.exports = class DriveClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
    this._client = new services.DriveClient(this.endpoint, grpc.credentials.createInsecure())
  }

  closeClient () {
    const channel = this._client.getChannel()
    channel.close()
  }

  get (opts, cb) {
    if (typeof opts === 'function') return this.get(null, opts)
    const req = new messages.GetDriveRequest()

    req.setOpts(toHyperdriveOptions(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.get(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const drive = new RemoteHyperdrive(this, this._client, this.token, rsp.getId(), fromHyperdriveOptions(rsp.getOpts()))
        return resolve(drive)
      })
    }))
  }

  allStats (opts, cb) {
    if (typeof opts === 'function') return this.stats(null, opts)
    const req = new messages.StatsRequest()

    if (opts && opts.networkingOnly) req.setNetworkingonly(true)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.allStats(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const statsList = rsp.getStatsList().map(stat => fromDriveStats(stat))
        return resolve(statsList)
      })
    }))
  }

  allNetworkConfigurations (cb) {
    const req = new messages.NetworkConfigurationsRequest()

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.allNetworkConfigurations(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const configMap = new Map(rsp.getConfigurationsList().map(rawConfig => {
          const configAndKey = fromNetworkConfiguration(rawConfig)
          const { key, ...networkConfig } = configAndKey
          return [configAndKey.key.toString('hex'), networkConfig]
        }))
        return resolve(configMap)
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
    this.discoveryKey = opts.discoveryKey
    this.hash = opts.hash
    this.writable = opts.writable
  }

  version (cb) {
    const req = new messages.DriveVersionRequest()

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

  configureNetwork (opts = {}, cb) {
    const req = new messages.ConfigureNetworkRequest()

    req.setId(this.id)
    req.setNetwork(toNetworkConfiguration({
      announce: !!opts.announce,
      lookup: !!opts.lookup,
      remember: opts.remember !== undefined ? opts.remember : true
    }))

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.configureNetwork(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  stats (opts, cb) {
    if (typeof opts === 'function') return this.stats(null, opts)
    const req = new messages.DriveStatsRequest()

    req.setId(this.id)
    if (opts && opts.recursive) req.setRecursive(true)
    if (opts && opts.networkingOnly) req.setNetworkingonly(true)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.stats(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const stats = fromDriveStats(rsp.getStats())
        const network = fromNetworkConfiguration(rsp.getNetwork())
        return resolve({ stats, network })
      })
    }))
  }

  download (path, opts, cb) {
    if (typeof opts === 'function') return this.download(path, null, opts)
    const req = new messages.DownloadRequest()

    req.setId(this.id)
    if (path) req.setPath(path)

    var downloadId = null

    const handler = {
      destroy: (cb) => {
        return maybe(cb, new Promise((resolve, reject) => {
          if (!downloadId) return reject(new Error('Destroy must be called after the download event has been received.'))
          this.undownload(downloadId, err => {
            if (err) return reject(err)
            return resolve()
          })
        }))
      }
    }

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.download(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        downloadId = rsp.getDownloadid()
        return resolve(handler)
      })
    }))
  }

  undownload (downloadId, cb) {
    const req = new messages.UndownloadRequest()

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

    const req = new messages.DiffStreamRequest()
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
    const req = new messages.ReadStreamRequest()

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

    const req = new messages.ReadFileRequest()
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
    const req = new messages.WriteStreamRequest()

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
        const req = new messages.WriteStreamRequest()
        req.setChunk(Buffer.from(chunk))
        return req
      }
    })

    return stream
  }

  writeFile (path, content, opts = {}, cb) {
    if (typeof opts === 'function') return this.writeFile(path, content, null, opts)
    if (!(content instanceof Buffer)) content = Buffer.from(content)

    const req = new messages.WriteFileRequest()
    req.setId(this.id)
    req.setPath(path)
    req.setOpts(toStat(opts))

    return maybe(cb, new Promise((resolve, reject) => {
      const call = this._client.writeFile(toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
      call.write(req)

      const chunks = toChunks(content)

      for (const chunk of chunks) {
        const req = new messages.WriteFileRequest()
        req.setChunk(chunk)
        call.write(req)
      }
      call.end()
    }))
  }

  updateMetadata (path, metadata, cb) {
    const req = new messages.UpdateMetadataRequest()
    req.setId(this.id)
    req.setPath(path)
    setMetadata(req.getMetadataMap(), metadata)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.updateMetadata(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  deleteMetadata (path, keys, cb) {
    const req = new messages.DeleteMetadataRequest()
    req.setId(this.id)
    req.setPath(path)
    req.setKeysList(keys)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.deleteMetadata(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  stat (path, opts, cb) {
    if (typeof opts === 'function') return this.stat(path, {}, opts)
    const req = new messages.StatRequest()
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
    if (typeof opts === 'function') return this.stat(path, {}, opts)
    const req = new messages.StatRequest()
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
    const req = new messages.UnlinkRequest()

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
    const req = new messages.MkdirRequest()
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
    const req = new messages.RmdirRequest()

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
    const req = new messages.ReadDirectoryRequest()
    opts = opts || {}
    path = path || '/'

    req.setId(this.id)
    req.setPath(path)
    if (opts.recursive) req.setRecursive(opts.recursive)
    if (opts.noMounts) req.setNomounts(opts.noMounts)
    if (opts.includeStats) req.setIncludestats(opts.includeStats)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.readdir(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const names = rsp.getFilesList()
        if (!opts.includeStats) return resolve(names)
        const statsList = rsp.getStatsList()
        const mountsList = rsp.getMountsList()
        const innerPathsList = rsp.getInnerpathsList()
        return resolve(names.map((name, i) => {
          return {
            name,
            stat: new Stat(fromStat(statsList[i])),
            mount: fromMount(mountsList[i]),
            innerPath: innerPathsList[i]
          }
        }))
      })
    }))
  }

  mount (path, opts, cb) {
    const req = new messages.MountDriveRequest()
    path = path || '/'

    const mountInfo = new messages.MountInfo()
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
    const req = new messages.UnmountDriveRequest()
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
    const req = new messages.WatchRequest()

    req.setId(this.id)
    req.setPath(path)

    const call = this._client.watch(toMetadata({ token: this.token }))
    call.write(req)

    call.on('data', () => cb())

    return function (cb) {
      return maybe(cb, new Promise(resolve => {
        const req = new messages.WatchRequest()
        call.write(req)
        return resolve()
      }))
    }
  }

  symlink (target, linkname, cb) {
    const req = new messages.SymlinkRequest()

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
    const req = new messages.CloseSessionRequest()

    req.setId(this.id)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.close(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        return resolve()
      })
    }))
  }

  fileStats (name, cb) {
    const req = new messages.FileStatsRequest()

    req.setId(this.id)
    req.setPath(name)

    return maybe(cb, new Promise((resolve, reject) => {
      this._client.fileStats(req, toMetadata({ token: this.token }), (err, rsp) => {
        if (err) return reject(err)
        const stats = fromFileStats(rsp.getStatsMap())
        return resolve(stats)
      })
    }))
  }
}
