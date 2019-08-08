const { HyperdriveOptions, DriveStats, MountStats, CoreStats } = require('./rpc/daemon/common_pb')
const { Stat, Mount } = require('./rpc/daemon/drive_pb.js')

const CHUNK_SIZE = 3.9e6
Stat.IFSOCK = 49152 // 0b1100...
Stat.IFLNK = 40960 // 0b1010...
Stat.IFREG = 32768 // 0b1000...
Stat.IFBLK = 24576 // 0b0110...
Stat.IFDIR = 16384 // 0b0100...
Stat.IFCHR = 8192 // 0b0010...
Stat.IFIFO = 4096 // 0b0001...

function fromHyperdriveOptions (opts) {
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
  opts = opts || {}

  const hdopts = new HyperdriveOptions()
  hdopts.setKey(opts.key)
  hdopts.setVersion(opts.version)
  hdopts.setHash(opts.hash)
  hdopts.setWritable(opts.writable)

  return hdopts
}

function fromMount (mount) {
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
  mountOpts = mountOpts || {}

  const mnt = new Mount()
  mnt.setKey(mountOpts.key)
  mnt.setVersion(mountOpts.version)
  mnt.setHash(mountOpts.hash)
  mnt.setHypercore(mountOpts.hypercore)
  return mnt
}

function fromStat (stat) {
  const metadataMap = stat.getMetadataMap()
  if (metadataMap) {
    var metadata = {}
    for (let key of Object.keys(stat.getMetadataMap())) {
      metadata[key] = metadataMap.get(key)
    }
  }

  return {
    isSocket: statModeCheck(Stat.IFSOCK),
    isSymbolicLink: statModeCheck(Stat.IFLNK),
    isFile: statModeCheck(Stat.IFREG),
    isBlockDevice: statModeCheck(Stat.IFBLK),
    isDirectory: statModeCheck(Stat.IFDIR),
    isCharacterDevice: statModeCheck(Stat.IFCHR),
    isFIFO: statModeCheck(Stat.IFIFO),
    mode: stat.getMode(),
    uid: stat.getUid(),
    gid: stat.getGid(),
    size: stat.getSize(),
    mtime: stat.getMtime(),
    ctime: stat.getCtime(),
    linkname: stat.getLinkname(),
    mount: fromMount(stat.getMount()),
    metadata
  }
}

function statModeCheck (mask) {
  return function () {
    return (mask & this.mode) === mask
  }
}

function toStat (statOpts) {
  if (!statOpts) return null

  const stat = new Stat()
  stat.setMode(statOpts.mode)
  stat.setUid(statOpts.uid)
  stat.setGid(statOpts.gid)
  stat.setSize(statOpts.size)
  stat.setMtime(statOpts.mtime)
  stat.setCtime(statOpts.ctime)
  stat.setLinkname(statOpts.linkname)
  stat.setMount(toMount(statOpts.mount))

  if (statOpts.metadata) {
    const metadataMap = stat.getMetadataMap()
    for (let key of Object.keys(statOpts.metadata)) {
      metadataMap.set(key, statOpts[key])
    }
  }

  return stat
}

function fromDriveStats (driveStats) {
  return driveStats.getStatsList().map(st => getMountStats(st))

  function getMountStats (mountStats) {
    return {
      path: mountStats.getPath(),
      metadata: getCoreStats(mountStats.getMetadata()),
      content: getCoreStats(mountStats.getContent())
    }
  }

  function getCoreStats (coreStats) {
    return {
      key: Buffer.from(coreStats.getKey()),
      peers: coreStats.getPeers(),
      uploadedBytes: coreStats.getUploadedbytes(),
      downloadedBytes: coreStats.getDownloadedbytes(),
      uploadedBytesCumulative: coreStats.getUploadedbytescumulative(),
      downloadedBytesCumulative: coreStats.getDownloadedbytescumulative()
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
    const contentStats = new CoreStats()

    setCoreStats(metadataStats, ms.metadata)
    setCoreStats(contentStats, ms.content)

    mountStats.setMetadata(metadataStats)
    mountStats.setContent(contentStats)

    mountStatsList.push(mountStats)
  }
  driveStats.setStatsList(mountStatsList)

  return driveStats

  function setCoreStats (coreStats, stats) {
    coreStats.setKey(stats.key)
    coreStats.setPeers(stats.peers)
    coreStats.setUploadedbytes(stats.uploadedBytes)
    coreStats.setDownloadedbytes(stats.downloadedBytes)
    coreStats.setUploadedbytescumulative(stats.uploadedBytesCumulative)
    coreStats.setDownloadedbytescumulative(stats.downloadedBytesCumulative)
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
  fromHyperdriveOptions,
  toHyperdriveOptions,
  fromStat,
  toStat,
  fromMount,
  toMount,
  fromDriveStats,
  toDriveStats,
  toChunks
}
