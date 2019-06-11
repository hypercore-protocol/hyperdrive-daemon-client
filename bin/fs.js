exports.command = 'fs <command>'
exports.desc = 'Interact with FUSE-mounted hyperdrives.'
exports.builder = function (yargs) {
  return yargs.commandDir('fs', { exclude: /(status)/ })
}
exports.handler = function (argv) {}
