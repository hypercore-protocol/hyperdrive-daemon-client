const { HyperdriveClient } = require('..')
const { loadMetadata } = require('./metadata')

module.exports = function loadClient (endpoint, token, cb) {
  if (typeof endpoint === 'function') return loadClient(null, null, endpoint)

  if (endpoint && token) return onmetadata(endpoint, token)
  loadMetadata((err, metadata) => {
    if (err) return cb(err)
    return onmetadata(metadata.endpoint, metadata.token)
  })

  function onmetadata (endpoint, token) {
    const client = new HyperdriveClient(endpoint, token)
    client.ready(err => {
      if (err) return cb(err, client)
      return cb(null, client)
    })
  }
}
