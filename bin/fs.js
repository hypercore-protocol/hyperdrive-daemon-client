exports.command = 'fs <command>'
exports.desc = 'Interact with FUSE-mounted hyperdrives.'
exports.builder = function (yargs) {
  return yargs
    .commandDir('fs')
    .demandCommand(1)
    .help()
}
exports.handler = function (argv) {}
