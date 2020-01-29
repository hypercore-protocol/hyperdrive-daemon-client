const p = require('path').posix
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const { normalize } = require('../../lib/paths')
const constants = require('../../lib/constants')

exports.command = 'key [mnt]'
exports.desc = 'Display the key for the drive mounted at the given mountpoint.'
exports.builder = {
  root: {
    description: 'Show the key of your private root drive.',
    type: 'boolean',
    default: false
  }
}

exports.handler = function (argv) {
  try {
    var mnt = normalize(argv.mnt)
  } catch (err) {
    return onerror(err)
  }

  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    client.fuse.key(mnt, (err, keyAndPath) => {
      if (err) return onerror(err)
      client.fuse.key(constants.mountpoint, (err, rootKeyAndPath) => {
        if (keyAndPath.key === rootKeyAndPath.key) {
          if (argv.root) return onsuccess(rootKeyAndPath.key, true)
          const err = new Error()
          err.details = 'You requested the key for your private root drive. To proceed, retry this command with --root (and be careful!).'
          return onerror(err)
        }
        return onsuccess(keyAndPath.key, false)
      })
    })
  }

  function onerror (err) {
    console.error(chalk.red(`Could get the drive key for mountpoint: ${mnt}`))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (key, root) {
    console.log(chalk.green(key))
    if (root) console.log(chalk.blue('\nThis is your root drive key. You probably should not share this.'))
  }
}
