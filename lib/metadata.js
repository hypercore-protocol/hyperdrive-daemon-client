const fs = require('fs')

const constants = require('./constants')

function loadMetadata (cb) {
  var endpoint = constants.env.endpoint
  var token = constants.env.token

  if (endpoint && token) return process.nextTick(cb, null, { endpoint, token })

  fs.readFile(constants.metadata, { encoding: 'utf8' }, (err, contents) => {
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
