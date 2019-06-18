const { HyperdriveClient } = require('..')
const { loadMetadata } = require('./metadata')

module.exports = function loadClient (cb) {
  loadMetadata((err, metadata) => {
    if (err) return onerror(err)
    const client = new HyperdriveClient(metadata.endpoint, metadata.token)
    client.ready(err => {
      if (err) return cb(err)
      return cb(null, client)
    })
  })
}
