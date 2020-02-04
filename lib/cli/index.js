const p = require('path').posix

const constants = require('../constants')

function normalize (path) {
  if (!path) return constants.mountpoint
  path = p.resolve(path)
  if (path.startsWith(constants.mountpoint)) return path
  if (path.startsWith(constants.hiddenMountpoint)) return p.join(constants.mountpoint, path.slice(constants.hiddenMountpoint.length))
  throw new Error(`Path ${path} is not contained within the Hyperdrive mountpoint`)
}

function keyForPath (client, path, showRootKey, cb) {
  client.fuse.key(path, (err, keyAndPath) => {
    if (err) return cb(err)
    client.fuse.key(constants.mountpoint, (err, rootKeyAndPath) => {
      if (err) return cb(err)
      if (keyAndPath.key === rootKeyAndPath.key) {
        if (showRootKey) return cb(null, rootKeyAndPath.key, true)
        const err = new Error()
        err.details = 'You requested the key for your private root drive. To proceed, retry this command with --root (and be careful!).'
        err.root = true
        return cb(err)
      }
      return cb(null, keyAndPath.key, false)
    })
  })
}

module.exports = {
  normalize,
  keyForPath
}
