exports.command = 'debug <command>'
exports.desc = 'Debug helpers'
exports.builder = function (yargs) {
  return yargs.commandDir('debug')
}
exports.handler = function (argv) {}
