const p = require('path')
const chalk = require('chalk')
const datEncoding = require('dat-encoding')
const ora = require('ora')

const loadClient = require('../lib/loader')
const { normalize } = require('../lib/cli')
const constants = require('../lib/constants')

exports.command = 'mount [path] [key]'
exports.desc = `Mount a drive at the specified mountpoint underneath the root.`
exports.builder = function (yargs) {
  return yargs
    .positional('path', {
      describe: 'The desired mountpoint (must be underneath ~/Hyperdrive)',
      type: 'string',
    })
    .positional('key', {
      describe: 'The key of the drive to mount (will create a new drive if not specified)',
      type: 'string'
    })
    .option('checkout', {
      describe: 'The checkout version of the drive that will be mounted.',
      type: 'number',
      default: null
    })
    .option('hash', {
      describe: 'The root hash of the drive that will be mounted.',
      type: 'string',
      default: null
    })
    .option('force-create', {
      describe: 'Force the creation of a new root drive',
      type: 'boolean',
      default: false
    })
    .option('seed', {
      describe: 'Seed the new drive on the Hyperdrive network',
      type: 'boolean',
      default: true
    })
    .help()
    .argv
}
exports.handler = function (argv) {
  var spinner = ora(chalk.blue('Mounting your drive (if seeding, this might take a while to announce)...'))
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    try {
      var mnt = normalize(argv.path)
    } catch (err) {
      return onerror(err)
    }
    // TODO: This is a hack to get around updating the schema. Add a force flag post-beta.
    if (argv['force-create']) argv.hash = 'force'
    spinner.start()
    client.fuse.mount(mnt, {
      key: argv.key ? datEncoding.decode(argv.key) : null,
      version: argv.checkout,
      hash: argv.hash ? Buffer.from(argv.hash) : null,
      seed: argv.seed
    }, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(rsp.path, rsp.mountInfo)
    })
  }

  function onerror (err) {
    spinner.fail(chalk.red('Could not mount the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt, opts) {
    const seeding = !!opts.seed

    spinner.succeed(chalk.green('Mounted a drive with the following info:'))
    console.log()
    console.log(chalk.green(`  Path: ${mnt} `))
    console.log(chalk.green(`  Key:  ${opts.key.toString('hex')} `))
    if (opts.version) console.log(chalk.green(`  Version:    ${opts.version}`))
    if (opts.hash) console.log(chalk.green(`  Hash:  ${opts.hash}`))
    console.log(chalk.green(`  Seeding: ${seeding}`))

    if (!seeding) {
      const mntString = mnt === '~/Hyperdrive --root true' ? '' : mnt
      console.log()
      console.log(chalk.green(`This drive is private by default. To publish it, run \`hyperdrive seed ${mntString}\` `))
    }

    process.exit(0)
  }
}
