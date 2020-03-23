const p = require('path')
const chalk = require('chalk')
const datEncoding = require('dat-encoding')
const ora = require('ora')

const loadClient = require('../lib/loader')
const { normalize } = require('../lib/cli')
const constants = require('../lib/constants')

exports.command = 'create [path]'
exports.desc = `Create a new drive mounted at the specified path`
exports.builder = function (yargs) {
  return yargs
    .positional('path', {
      describe: 'The desired mountpoint inside your root drive at ~/Hyperdrive',
      type: 'string',
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
  var spinner = ora(chalk.blue('Creating your new drive (if seeding, this might take a while to announce)...'))
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
    spinner.start()
    client.fuse.mount(mnt, {
      seed: argv.seed
    }, (err, rsp) => {
      if (err) return onerror(err)
      return onsuccess(rsp.path, rsp.mountInfo)
    })
  }

  function onerror (err) {
    spinner.fail(chalk.red('Could not create the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt, opts) {
    const seeding = !!opts.seed

    spinner.succeed(chalk.green('Created a drive with the following info:'))
    console.log()
    console.log(chalk.green(`  Path: ${mnt} `))
    console.log(chalk.green(`  Key:  ${opts.key.toString('hex')} `))
    if (opts.version) console.log(chalk.green(`  Version:    ${opts.version}`))
    if (opts.hash) console.log(chalk.green(`  Hash:       ${opts.hash}`))
    console.log(chalk.green(`  Seeding: ${seeding}`))

    if (!seeding) {
      const mntString = mnt === '~/Hyperdrive --root true' ? '' : mnt
      console.log()
      console.log(chalk.green(`This drive is private by default. To publish it, run \`hyperdrive seed ${mntString}\` `))
    }

    process.exit(0)
  }
}
