const p = require('path')
const fs = require('fs')

const constants = require('./constants')

function loadMetadata (storage, cb) {
  if (typeof storage === 'function') {
    cb = storage
    storage = null
  }
  var endpoint = constants.env.endpoint
  var token = constants.env.token

  if (endpoint && token) return process.nextTick(cb, null, { endpoint, token })

  var metadataPath
  if (storage) metadataPath = p.join(storage, 'metadata.json')
  else if (constants.env.storage) metadataPath = p.join(constants.env.storage, 'metadata.json')
  else metadataPath = constants.metadata

  fs.readFile(metadataPath, { encoding: 'utf8' }, (err, contents) => {
    if (err) return cb(err)
    try {
      var metadata = JSON.parse(contents)
    } catch (err) {
      return cb(new Error(`The metadata is malformed: ${err}`))
    }
    return cb(null, metadata)
  })
}

module.exports = {
  loadMetadata
}
