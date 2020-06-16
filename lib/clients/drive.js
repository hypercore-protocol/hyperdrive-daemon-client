const maybe = require('call-me-maybe')
const collectStream = require('stream-collector')
const pump = require('pump')
const codecs = require('codecs')
const hyperdrive = require('hyperdrive')
const { Writable, Transform } = require('streamx')

const { Stat } = require('hyperdrive-schemas')

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
        return drive.drive.mount(path, opts.key, opts, err => {
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

    const promiseWatch = drive.watch.bind(drive)
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
      const network = await this._client.network.getConfiguration(drive.discoveryKey)
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

  async _runNetworkingHeuristics (drive) {
    // Always lookup readable drives.
    if (!drive.writable) {
      const networkConfig = await this._client.network.getConfiguration(drive.discoveryKey)
      if (!networkConfig) await this._client.network.configure(drive.discoveryKey, { announce: false, lookup: true, remember: false })
    }
    // Lookups must be done on new mounts immediately, then apply the parent's network config if an existing config does not exist.
    const mountListener = async (trie) => {
      try {
        await this._client.network.configure(trie.feed.discoveryKey, { copyFrom: drive.discoveryKey, lookup: !trie.feed.writable, overwrite: false })
      } catch (err) {
        // If the configuration couldn't be overwritten, that's OK.
      }
    }
    const innerDrive = drive.drive
    innerDrive.on('mount', mountListener)
    innerDrive.once('close', () => innerDrive.removeListener('mount', mountListener))
  }

  async _createDrive (opts) {
    var drive = hyperdrive(this._client.corestore, opts && opts.key, {
      ...opts,
      extension: false
    }).promises
    await drive.ready()
    await this._runNetworkingHeuristics(drive)
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
    const configs = await this._client.network.getAllConfigurations()
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
    for (const key of keys) {
      const feed = this._client.corestore.get(key)
      await feed.ready()
      peerCounts.push(feed.peers.length)
      await feed.close()
    }
    return peerCounts
  }

  async peerCounts (keys, cb) {
    return maybe(cb, this._peerCounts(keys))
  }
}
