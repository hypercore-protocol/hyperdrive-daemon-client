const p = require('path').posix
const { Command, flags } = require('@oclif/command')

const { HyperdriveClient } = require('../..')
const constants = require('../constants')

class DaemonCommand extends Command {
  static keyFlag (info) {
    return flags.build({
      description: 'The drive key',
      required: false,
      parse: keyParser,
      ...info
    })()
  }

  static keyArg (info) {
    return {
      name: 'key',
      description: 'The drive key',
      required: false,
      parse: keyParser
    }
  }

  static drivePathArg (info) {
    return {
      name: 'path',
      description: 'The path to the drive (must be within ~/Hyperdrive)',
      parse: path => {
        if (!path) return constants.mountpoint
        path = p.resolve(path)
        if (path.startsWith(constants.networkPath)) throw new Error('Hyperdrive commands cannot be run on the Network directory.')
        if (path.startsWith(constants.mountpoint)) return path
        throw new Error(`Path ${path} is not contained within the Hyperdrive mountpoint`)
      },
      ...info
    }
  }

  async infoForPath (path, showRootInfo) {
    const infoAndPath = await this.client.fuse.info(path)
    const rootInfoAndPath = await this.client.fuse.info(constants.mountpoint)
    if (infoAndPath.key === rootInfoAndPath.key) {
      if (showRootInfo) return { ...rootInfoAndPath, root: true }
      const err = new Error()
      err.details = 'You requested info about your private root drive. To proceed, retry this command with --root (and be careful!).'
      err.root = true
      throw err
    }
    return { ...infoAndPath, root: false }
  }

  constructor (argv, config) {
    super(argv, config)
    this.client = null
  }

  async run () {
    try {
      this.client = new HyperdriveClient()
      await this.client.ready()
    } catch (err) {
      console.error('Could not connect to the daemon. Is it running? Check with `hyperdrive status`.')
      this.exit(1)
    }
  }
}

function keyParser (keyString) {
  const splitKeyString = keyString.split('://')
  if (splitKeyString.length > 1) keyString = splitKeyString[1]
  const key = Buffer.from(keyString, 'hex')
  if (key.length !== 32) throw new Error('Key must be a 32-byte long hex string.')
  return key
}

module.exports = DaemonCommand
