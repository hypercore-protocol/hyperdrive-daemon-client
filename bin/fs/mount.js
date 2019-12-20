const p = require('path')
const chalk = require('chalk')
const datEncoding = require('dat-encoding')

const loadClient = require('../../lib/loader')
const constants = require('../../lib/constants')

exports.command = 'mount [mnt] [key]'
exports.desc = `Mount a drive at the specified mountpoint underneath the root.`
exports.builder = {
  version: {
    description: 'The version of the drive that will be mounted.',
    type: 'number',
    default: null
  },
  hash: {
    description: 'The root hash of the drive that will be mounted.',
    type: 'string',
    default: null
  },
  publish: {
    description: 'Make the drive available to the network',
    type: 'boolean',
    default: false
  },
  'force-create': {
    description: 'Force the creation of a new root drive',
    type: 'boolean',
    default: false
  }
}
exports.handler = function (argv) {
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    const mnt = argv.mnt ? p.posix.resolve(argv.mnt) : constants.mountpoint
    if (mnt !== constants.mountpoint && !mnt.startsWith(constants.home)) return onerror(new Error(`You can only mount drives underneath the root drive at ${constants.home}`))
    // TODO: This is a hack to get around updating the schema. Add a force flag post-beta.
    if (argv['force-create']) argv.hash = 'force'
    client.fuse.mount(mnt, {
      key: argv.key ? datEncoding.decode(argv.key) : null,
      version: argv.version,
      hash: argv.hash ? Buffer.from(argv.hash) : null,
      seed: argv.publish
    }, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(rsp.path, rsp.mountInfo)
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not mount the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt, opts) {
    const seeding = !!argv.key

    console.log(chalk.green('Mounted a drive with the following info:'))
    console.log()
    console.log(chalk.green(`  Mountpoint: ${mnt} `))
    console.log(chalk.green(`  Key:        ${opts.key.toString('hex')} `))
    if (opts.version) console.log(chalk.green(`  Version:    ${opts.version}`))
    if (opts.hash) console.log(chalk.green(`  Hash:       ${opts.hash}`))
    console.log(chalk.green(`  Seeding:    ${seeding}`))
    console.log()

    if (!seeding) {
      const mntString = mnt === '/hyperdrive --root true' ? '' : mnt
      console.log(chalk.green(`This drive is private by default. To publish it, run \`hyperdrive fs publish ${mntString}\` `))
    }
    process.exit(0)
  }
}
