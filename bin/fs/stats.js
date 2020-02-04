const p = require('path')
const fs = require('fs')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const { normalize, keyForPath } = require('../../lib/cli')
const constants = require('../../lib/constants')

exports.command = 'stats [path]'
exports.desc = 'Get the networking stats for the drive mounted at a path.'
exports.builder = {
  root: {
    description: 'Show the networking stats of your private root drive.',
    type: 'boolean',
    default: false
  }
}

exports.handler = function (argv) {
  let path = argv.path || process.cwd()
  try {
    path = normalize(path)
  } catch (err) {
    return onerror(err)
  }

  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    keyForPath(client, path, argv.root, (err, key, isRoot) => {
      if (err) return onerror(err)
      return onsuccess(key, isRoot)
    })
  }

  function onsuccess (key, isRoot) {
    fs.readFile(p.join(constants.mountpoint, 'Network', 'Stats', key, 'networking.json'), { encoding: 'utf8' }, (err, file) => {
      if (err) return onerror(err)
      console.log(file)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not mount the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }
}
