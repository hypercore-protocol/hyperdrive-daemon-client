const { HyperdriveOptions } = require('./rpc/daemon/common_pb')
const { Stat, Mount } = require('./rpc/daemon/drive_pb.js')

function fromHyperdriveOptions (opts) {
  const extracted = {
    key: opts.getKey() || null,
    version: opts.getVersion() || null,
    hash: opts.getHash() || null,
    seed: opts.getSeed(),
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
  return hdopts
}

function fromMount (mount) {
  return {
    key: mount.getKey(),
    version: mount.getVersion(),
    hash: mount.getHash(),
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

module.exports = {
  fromHyperdriveOptions,
  toHyperdriveOptions,
  fromStat,
  toStat,
}
