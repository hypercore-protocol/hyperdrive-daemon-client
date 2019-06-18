#!/usr/bin/env node
const yargs = require('yargs')

const args = yargs.commandDir('bin', { exclude: /list.js/ } )

if (require.main === module) {
  return args.demandCommand()
  .help()
  .argv
} else {
  module.exports = args
}
