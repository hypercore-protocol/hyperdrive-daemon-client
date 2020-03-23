const p = require('path').posix
const chalk = require('chalk')

const loadClient = require('../lib/loader')
const { normalize, infoForPath } = require('../lib/cli')
const constants = require('../lib/constants')

exports.command = 'info [path]'
exports.desc = 'Display information about the drive mounted at the given mountpoint.'
exports.builder = {
  root: {
    description: 'Show info about your private root drive.',
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
    infoForPath(client, path, argv.root, (err, info, isRoot) => {
      if (err) return onerror(err)
      return onsuccess(info, isRoot)
    })
  }

  function onerror (err) {
    console.error(chalk.red(`Could get info for mountpoint: ${path}`))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (info, root) {
    const isMount = !info.mountPath
    const parentMount = !isMount ? path.slice(0, path.length - info.mountPath.length) : ''
    const parentInfo = !isMount ? `(the parent mount is ${parentMount})` : ''
    console.log(chalk.green('Drive Info:'))
    console.log()
    console.log(chalk.green(`  Key:          ${info.key}`))
    console.log(chalk.green(`  Is Mount:     ${isMount} ${parentInfo}`))
    console.log(chalk.green(`  Writable:     ${info.writable}`))
    if (root) console.log(chalk.blue('\nThis is info about your root drive. You probably should not share this.'))
  }
}
