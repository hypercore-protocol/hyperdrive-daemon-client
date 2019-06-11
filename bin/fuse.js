exports.command = 'fuse <command>'
exports.desc = 'Interact with FUSE-mounted hyperdrives.'
exports.builder = function (yargs) {
  return yargs.commandDir('fuse')
}
exports.handler = function (argv) {}
