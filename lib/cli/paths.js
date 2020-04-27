const p = require('path').posix

const constants = require('./constants')

function normalize (path) {
  if (!path) return constants.mountpoint
  path = p.resolve(path)
  if (path.startsWith(constants.mountpoint)) return path
  throw new Error(`Path ${path} is not contained within the Hyperdrive mountpoint`)
}

module.exports = {
  normalize
}
