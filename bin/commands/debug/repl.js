const fs = require('fs')
const path = require('path')
const { Command } = require('@oclif/command')

const { storage } = require('../../../lib/constants')
const { HyperdriveClient } = require('../../..')

class DebugReplCommand extends Command {
  static usage = 'repl'
  static description = 'Open a daemon REPL'

  async run () {
    const self = this
    const client = new HyperdriveClient()
    await client.ready()
    client.debug.repl()
  }
}

module.exports = DebugReplCommand
