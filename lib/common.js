const datEncoding = require('dat-encoding')

const { Profile, HyperdriveOptions, DriveStats, MountStats, CoreStats, FileStats, DownloadProgress, NetworkConfiguration } = require('./rpc/daemon/common_pb')
const { Stat, Mount, DiffEntry } = require('./rpc/daemon/drive_pb.js')

const CHUNK_SIZE = 3.9e6

function fromProfile (opts) {
  if (!opts) return {}
  return {
    drive: fromHyperdriveOptions(opts.drive),
    name: opts.getName()
  }
}

function toProfile (opts) {
  if (!opts) return null

  const profile = new Profile()
  profile.setDrive(toHyperdriveOptions(opts.drive))
  profile.setName(opts.name)

  return profile
}

function fromHyperdriveOptions (opts) {
  if (!opts) return {}

  const extracted = {
    key: opts.getKey() || null,
    version: opts.getVersion() || null,
    hash: opts.getHash() || null,
    writable: opts.getWritable() || false
  }
  if (extracted.key) extracted.key = Buffer.from(extracted.key)
  if (extracted.hash) extracted.hash = Buffer.from(extracted.hash)
  return extracted
}

function toHyperdriveOptions (opts) {
  if (!opts) return null
  if (opts.key && typeof opts.key === 'string') {
    opts.key = datEncoding.decode(opts.key)
  }

  const hdopts = new HyperdriveOptions()
  hdopts.setKey(opts.key)
  hdopts.setVersion(opts.version)
  hdopts.setHash(opts.hash)
  hdopts.setWritable(opts.writable)

  return hdopts
}

function fromMount (mount) {
  if (!mount) return null

  const key = mount.getKey()
  const hash = mount.getHash()
  return {
    key: key ? Buffer.from(key) : null,
    hash: hash ? Buffer.from(hash) : null,
    version: mount.getVersion(),
    hypercore: mount.getHypercore()
  }
}

function toMount (mountOpts) {
  if (!mountOpts) return null

  const mnt = new Mount()
  mnt.setKey(mountOpts.key)
  mnt.setVersion(mountOpts.version)
  mnt.setHash(mountOpts.hash)
  mnt.setHypercore(mountOpts.hypercore)
  return mnt
}

function fromStat (stat) {
  if (!stat) return {}

  return {
    mode: stat.getMode(),
    uid: stat.getUid(),
    gid: stat.getGid(),
    size: stat.getSize(),
    mtime: stat.getMtime(),
    ctime: stat.getCtime(),
    linkname: stat.getLinkname(),
    mount: fromMount(stat.getMount()),
    metadata: fromMetadata(stat.getMetadataMap())
  }
}

function toStat (statOpts) {
  if (!statOpts) return null

  const stat = new Stat()
  stat.setMode(statOpts.mode)
  stat.setUid(statOpts.uid)
  stat.setGid(statOpts.gid)
  stat.setSize(statOpts.size)
  stat.setMtime(statOpts.mtime ? statOpts.mtime.getTime() : null)
  stat.setCtime(statOpts.ctime ? statOpts.ctime.getTime() : null)
  stat.setLinkname(statOpts.linkname)
  stat.setMount(toMount(statOpts.mount))

  if (statOpts.metadata) {
    setMetadata(stat.getMetadataMap(), statOpts.metadata)
  }

  return stat
}

function setMetadata (map, metadataObj) {
  if (!map || !metadataObj) return null
  for (let key of Object.keys(metadataObj)) {
    if (metadataObj[key]) {
      map.set(key, metadataObj[key])
    }
  }
}

function fromMetadata (map) {
  const metadata = {}
  if (!map || !map.getLength()) return metadata
  map.forEach((value, key) => {
    metadata[key] = Buffer.from(value)
  })
  return metadata
}

function fromDriveStats (driveStats) {
  if (!driveStats) return null

  return driveStats.getStatsList().map(st => getMountStats(st))

  function getMountStats (mountStats) {
    return {
      path: mountStats.getPath(),
      metadata: getCoreStats(mountStats.getMetadata()),
      content: getCoreStats(mountStats.getContent())
    }
  }

  function getCoreStats (coreStats) {
    if (!coreStats) return {}
    return {
      key: Buffer.from(coreStats.getKey()),
      peers: coreStats.getPeers(),
      uploadedBytes: coreStats.getUploadedbytes(),
      downloadedBytes: coreStats.getDownloadedbytes(),
      uploadedBytesCumulative: coreStats.getUploadedbytescumulative(),
      downloadedBytesCumulative: coreStats.getDownloadedbytescumulative(),
      totalBlocks: coreStats.getTotalblocks(),
      downloadedBlocks: coreStats.getDownloadedblocks()
    }
  }
}

function toDriveStats (stats) {
  if (!stats) return null

  const driveStats = new DriveStats()
  const mountStatsList = []
  for (const ms of stats) {
    const mountStats = new MountStats()
    mountStats.setPath(ms.path)

    const metadataStats = new CoreStats()
    setCoreStats(metadataStats, ms.metadata)
    mountStats.setMetadata(metadataStats)

    if (ms.content) {
      const contentStats = new CoreStats()
      setCoreStats(contentStats, ms.content)
      mountStats.setContent(contentStats)
    }

    mountStatsList.push(mountStats)
  }
  driveStats.setStatsList(mountStatsList)

  return driveStats

  function setCoreStats (coreStats, stats) {
    coreStats.setKey(stats.key)
    coreStats.setPeers(stats.peerCount)
    coreStats.setUploadedbytes(stats.uploadedBytes)
    coreStats.setDownloadedbytes(stats.downloadedBytes)
    coreStats.setUploadedbytescumulative(stats.uploadedBytesCumulative)
    coreStats.setDownloadedbytescumulative(stats.downloadedBytesCumulative)
    coreStats.setTotalblocks(stats.totalBlocks)
    coreStats.setDownloadedblocks(stats.downloadedBlocks)
  }
}

function fromDiffEntry (diffEntry) {
  if (!diffEntry) return {}

  const diff = {}
  const mnt = diffEntry.getMount()
  const stat = diffEntry.getStat()
  if (mnt) diff.mount = fromMount(mnt)
  if (stat) diff.stat = fromStat(stat)

  return diff
}

function toDiffEntry (rawEntry) {
  const diffEntry = new DiffEntry()
  if (rawEntry.stat) {
    diffEntry.setStat(toStat(rawEntry.stat))
  }
  if (rawEntry.mount) {
    diffEntry.setMount(toMount(rawEntry.mount))
  }
  return diffEntry
}

function toDownloadProgress (stats) {
  const p = new DownloadProgress()
  p.setTotalbytes(stats.totalBytes)
  p.setDownloadedbytes(stats.downloadedBytes)
  p.setTotalblocks(stats.totalBlocks)
  p.setDownloadedblocks(stats.downloadedBlocks)
  return p
}

function fromDownloadProgress (rsp) {
  return {
    totalBytes: rsp.getTotalbytes(),
    totalBlocks: rsp.getTotalblocks(),
    downloadedBytes: rsp.getDownloadedbytes(),
    downloadedBlocks: rsp.getDownloadedblocks()
  }
}

function setFileStats (map, statsObj) {
  if (!map || !statsObj) return null
  for (let [path, stats] of statsObj) {
    map.set(path, toFileStats(stats))
  }

  function toFileStats (stats) {
    const s = new FileStats()
    s.setSize(stats.size)
    s.setBlocks(stats.blocks)
    s.setDownloadedbytes(stats.downloadedBytes)
    s.setDownloadedblocks(stats.downloadedBlocks)
    return s
  }
}

function fromFileStats (map) {
  const stats = new Map()
  if (!map || !map.getLength()) return stats
  map.forEach((value, key) => {
    stats.set(key, fromFileStat(value))
  })
  return stats

  function fromFileStat (stat) {
    return {
      size: stat.getSize(),
      blocks: stat.getBlocks(),
      downloadedBytes: stat.getDownloadedbytes(),
      downloadedBlocks: stat.getDownloadedblocks()
    }
  }
}

function toNetworkConfiguration (config) {
  const networkConfig = new NetworkConfiguration()
  networkConfig.setAnnounce(config.announce)
  networkConfig.setLookup(config.lookup)
  networkConfig.setRemember(config.remember)
  return networkConfig
}

function fromNetworkConfiguration (networkConfig) {
  if (!networkConfig) return {}
  return {
    lookup: networkConfig.getLookup(),
    announce: networkConfig.getAnnounce(),
    remember: networkConfig.getRemember()
  }
}

function toChunks (content) {
  const chunks = []

  for (let i = 0; i * CHUNK_SIZE < content.length; i++) {
    const offset = i * CHUNK_SIZE
    const len = Math.min(CHUNK_SIZE, content.length - offset)
    const chunk = Buffer.allocUnsafe(len)
    content.copy(chunk, 0, offset, offset + len)
    chunks.push(chunk)
  }

  return chunks
}

module.exports = {
  fromProfile,
  toProfile,
  fromHyperdriveOptions,
  toHyperdriveOptions,
  fromStat,
  toStat,
  fromMount,
  toMount,
  fromDriveStats,
  toDriveStats,
  fromDiffEntry,
  toDiffEntry,
  fromDownloadProgress,
  toDownloadProgress,
  fromFileStats,
  setFileStats,
  toChunks,
  setMetadata,
  fromMetadata,
  toNetworkConfiguration,
  fromNetworkConfiguration
}
