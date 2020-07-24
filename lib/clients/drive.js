const maybe = require('call-me-maybe')
const pump = require('pump')
const hyperdrive = require('hyperdrive')
const applyHeuristics = require('hyperdrive-network-heuristics')
const { Transform } = require('streamx')

module.exports = class DriveClient {
  constructor (client) {
    this._client = client
    this._drives = new Set()
  }

  _addCompatMethods (drive) {
    drive.configureNetwork = (opts = {}, cb) => {
      return maybe(cb, this._client.network.configure(drive.metadata.discoveryKey, opts))
    }

    Object.defineProperty(drive, 'version', {
      enumerable: true,
      value: () => drive.drive.version
    })

    // TODO: This needs to be fixed to not use _update (but it needs to be atomic).
    drive.updateMetadata = (path, metadata, cb) => {
      return maybe(cb, new Promise((resolve, reject) => {
        return drive.drive._update(path, { metadata }, err => {
          if (err) return reject(err)
          return resolve(null)
        })
      }))
    }
    // TODO: This needs to be fixed to not use _update (but it needs to be atomic).
    drive.deleteMetadata = (path, keys, cb) => {
      return maybe(cb, new Promise((resolve, reject) => {
        const metadata = {}
        for (const key of keys) {
          metadata[key] = null
        }
        return drive.drive._update(path, { metadata }, err => {
          if (err) return reject(err)
          return resolve(null)
        })
      }))
    }

    drive.mount = (path, opts, cb) => {
      return maybe(cb, new Promise((resolve, reject) => {
        return drive.drive.mount(path, opts && opts.key, opts, err => {
          if (err) return reject(err)
          return resolve(null)
        })
      }))
    }

    drive.createDiffStream = (other, prefix) => {
      const diffStream = drive.drive.createDiffStream(other, prefix)
      return pump(diffStream, new Transform({
        transform (msg, cb) {
          if (msg.type === 'put') {
            msg.value = { stat: msg.value }
          } else if (msg.type === 'mount') {
            msg.value = { mount: msg.value }
          }
          return cb(null, msg)
        }
      }))
    }

    const promiseCheckout = drive.checkout.bind(drive)
    drive.checkout = (version, opts) => {
      const checkout = promiseCheckout(version, opts)
      this._addCompatMethods(checkout)
      return checkout
    }

    drive.watch = (path, onwatch) => {
      const watcher = drive.drive.watch(path, onwatch)
      return watcher.destroy
    }

    // The client did not previously expose a way to wait for the download to complete. This is for compat.
    const downloadPromise = drive.download.bind(drive)
    drive.download = (path, opts, cb) => {
      const prom = downloadPromise(path, opts)
      const handleProm = Promise.resolve({ destroy: prom.destroy })
      return maybe(cb, handleProm)
    }

    drive.stats = async (opts, cb) => {
      if (typeof opts === 'function') {
        opts = null
        cb = opts
      }
      opts = opts || {}
      const network = await this._client.network.status(drive.discoveryKey)
      const mounts = await drive.getAllMounts({ memory: true, recursive: !!opts.recursive })
      const stats = []

      for (const [path, { metadata, content }] of mounts) {
        stats.push({
          path,
          metadata: await getCoreStats(metadata),
          content: await getCoreStats(content)
        })
      }

      return { stats, network }

      async function getCoreStats (core) {
        if (!core) return {}
        const stats = core.stats
        const networkingStats = {
          key: core.key,
          discoveryKey: core.discoveryKey,
          peers: core.peers.length
        }
        return {
          ...networkingStats,
          uploadedBytes: (stats && stats.totals.uploadedBytes) || 0,
          uploadedBlocks: (stats && stats.totals.uploadedBlocks) || 0,
          downloadedBytes: (stats && stats.totals.downloadedBytes) || 0,
          downloadedBlocks: opts.networkingOnly ? 0 : await core.downloaded(),
          totalBlocks: core.length
        }
      }
    }

    drive.fileStats = async (name, cb) => {
      return maybe(cb, new Promise((resolve, reject) => {
        drive.drive.stats(name, (err, stats) => {
          if (err) return reject(err)
          if (!(stats instanceof Map)) {
            const fileStats = stats
            stats = new Map()
            stats.set(name, fileStats)
          }
          return resolve(stats)
        })
      }))
    }
  }

  // hyperdrive-daemon-client works both with Promises and callbacks. hyperdrive.promises is exclusively promises.
  // This adds callback support to the promises API.
  _makeCallbackCompat (drive) {
    const methodNames = [
      'readFile',
      'writeFile',
      'stats',
      'mirror',
      'updateMetadata',
      'deleteMetadata',
      'stat',
      'lstat',
      'unlink',
      'mkdir',
      'rmdir',
      'readdir',
      'mount',
      'unmount',
      'symlink',
      'close',
      'fileStats',
      'mounts'
    ]
    for (const methodName of methodNames) {
      if (!drive[methodName]) continue
      const oldMethod = drive[methodName].bind(drive)
      drive[methodName] = (...args) => {
        var cb = null
        if (typeof args[args.length - 1] === 'function') {
          cb = args.pop()
        }
        return maybe(cb, oldMethod(...args))
      }
    }
  }

  async _createDrive (opts) {
    const store = this._client.corestore()
    var drive = hyperdrive(store, opts && opts.key, {
      ...opts,
      extension: false
    }).promises
    await drive.ready()
    await this._makeCallbackCompat(drive)
    await applyHeuristics(drive, this._client.network)
    await this._addCompatMethods(drive)

    this._drives.add(drive)
    drive.drive.once('close', () => {
      this._drives.delete(drive)
    })

    return drive
  }

  get (opts, cb) {
    if (typeof opts === 'function') return this.get(null, opts)
    return maybe(cb, this._createDrive(opts))
  }

  // TODO: This cannot be backwards compat because network configurations are indexed by discovery key.

  async _allNetworkConfigurations () {
    const configs = await this._client.network.allStatuses()
    const configMap = new Map()
    for (const config of configs) {
      configMap.set(config.discoveryKey.toString('hex'), config)
    }
    return configMap
  }

  allNetworkConfigurations (cb) {
    return maybe(cb, this._allNetworkConfigurations())
  }

  async _allStats (opts) {
    const stats = []
    for (const drive of this._drives) {
      const driveStats = await drive.stats(opts)
      stats.push(driveStats.stats)
    }
    return stats
  }

  allStats (opts, cb) {
    if (typeof opts === 'function') return this.allStats(null, opts)
    return maybe(cb, this._allStats(opts))
  }

  async _peerCounts (keys) {
    if (!keys || !keys.length) throw new Error('peerCounts must be given a list of drive keys.')
    const peerCounts = []
    const store = this._client.corestore()
    for (const key of keys) {
      const feed = store.get(key)
      await feed.ready()
      peerCounts.push(feed.peers.length)
    }
    await store.close()
    return peerCounts
  }

  async peerCounts (keys, cb) {
    return maybe(cb, this._peerCounts(keys))
  }
}
