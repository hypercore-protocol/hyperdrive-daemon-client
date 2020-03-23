const p = require('path').posix

const constants = require('../constants')

function normalize (path) {
  if (!path) return constants.mountpoint
  path = p.resolve(path)
  if (path.startsWith(constants.mountpoint)) return path
  if (path.startsWith(constants.hiddenMountpoint)) return p.join(constants.mountpoint, path.slice(constants.hiddenMountpoint.length))
  throw new Error(`Path ${path} is not contained within the Hyperdrive mountpoint`)
}

function infoForPath (client, path, showRootInfo, cb) {
  client.fuse.info(path, (err, infoAndPath) => {
    if (err) return cb(err)
    client.fuse.info(constants.mountpoint, (err, rootInfoAndPath) => {
      if (err) return cb(err)
      if (infoAndPath.key === rootInfoAndPath.key) {
        if (showRootInfo) return cb(null, rootInfoAndPath, true)
        const err = new Error()
        err.details = 'You requested info about your private root drive. To proceed, retry this command with --root (and be careful!).'
        err.root = true
        return cb(err)
      }
      return cb(null, infoAndPath, false)
    })
  })
}

module.exports = {
  normalize,
  infoForPath
}
