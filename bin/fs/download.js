const p = require('path').posix
const chalk = require('chalk')
const progress = require('cli-progress')

const loadClient = require('../../lib/loader')
const constants = require('../../lib/constants')

const POLL_INTERVAL = 300

exports.command = 'download [path]'
exports.desc = 'Download the file or directory at the given path.'
exports.builder = {}

exports.handler = async function (argv) {
  const path = argv.path
  if (!path) return onerror(new Error('You must specify a path to download.'))

  var bar = new progress.SingleBar()
  var downloadId = null
  var drive = null

  try {
    const client = await new Promise((resolve, reject) => {
      loadClient((err, client) => {
        if (err) return reject(err)
        return resolve(client)
      })
    })
    const keyAndPath = await client.fuse.key(path)
    drive = await client.drive.get({ key: keyAndPath.key })
    const downloadId = await drive.download(keyAndPath.path)
    const initialStats = await drive.fileStats(keyAndPath.path)
    onstart(initialStats)
    return cleanup()
  } catch (err) {
    return cleanup(err)
  }

  async function cleanup (err) {
    try {
      if (downloadId) await drive.undownload(downloadId)
      if (drive) await drive.close()
      if (err) return onerror(err)
      return onsuccess()
    } catch (error) {
      return onerror(error)
    }
  }

  function onstart (initialStats) {

  }

  function onprogress () {

  }

  function onerror (err) {

  }

  function onsuccess () {

  }
}
