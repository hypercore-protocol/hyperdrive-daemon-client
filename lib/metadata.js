const p = require('path')
const fs = require('fs').promises

const constants = require('./constants')

async function loadMetadata (storage) {
  var endpoint = constants.env.endpoint
  var token = constants.env.token

  if (endpoint && token) return { endpoint, token }

  var metadataPath
  if (storage) metadataPath = p.join(storage, 'config.json')
  else if (constants.env.storage) metadataPath = p.join(constants.env.storage, 'config.json')
  else metadataPath = constants.metadata

  const contents = await fs.readFile(metadataPath, { encoding: 'utf8' })
  try {
    var metadata = JSON.parse(contents)
  } catch (err) {
    throw new Error(`The metadata is malformed: ${err}`)
  }

  return metadata
}

module.exports = {
  loadMetadata
}
