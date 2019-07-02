const fs = require('fs')
const p = require('path')
const os = require('os')

const METADATA_FILE_PATH = p.join(os.homedir(), '.hyperdrive')

function loadMetadata (cb) {
  var endpoint = process.env['HYPERDRIVE_ENDPOINT']
  var token = process.env['HYPERDRIVE_TOKEN']

  if (endpoint && token) return process.nextTick(cb, null, { endpoint, token })

  fs.readFile(METADATA_FILE_PATH, { encoding: 'utf8' }, (err, contents) => {
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

