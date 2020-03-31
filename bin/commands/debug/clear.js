const fs = require('fs')
const path = require('path')
const { Command } = require('@oclif/command')

const { storage } = require('../../../lib/constants')
const { HyperdriveClient } = require('../../..')

class DebugClearCommand extends Command {
  static usage = 'clear'
  static description = 'Removes all readonly data from disk'

  async run () {
    const self = this

    try {
      const client = new HyperdriveClient()
      await client.ready()
      await client.status()
      console.error('The Hyperdrive *must* not be running')
    } catch (err) {
      cleanup()
    }

    function cleanup () {
      let cnt = 0
      for (const p of listReadonly()) {
        rmFeed(p)
        cnt++
      }
      console.log('Removed ' + cnt + ' readonly feed(s)')
      self.exit()
    }
  }
}

module.exports = DebugClearCommand

function rmFeed (p) {
  rm('bitfield')
  rm('data')
  rm('key')
  rm('signatures')
  rm('tree')
  fs.rmdirSync(p)

  function rm (name) {
    if (fs.existsSync(path.join(p, name))) {
      fs.unlinkSync(path.join(p, name))
    }
  }
}

function listReadonly () {
  const all = []
  for (const pre of fs.readdirSync(path.join(storage, 'cores'))) {
    if (pre.length !== 2) continue
    for (const mid of fs.readdirSync(path.join(storage, 'cores', pre))) {
      if (mid.length !== 2) continue
      for (const suf of fs.readdirSync(path.join(storage, 'cores', pre, mid))) {
        const p = path.join(storage, 'cores', pre, mid, suf)
        if (fs.existsSync(path.join(p, 'name'))) continue
        all.push(p)
      }
    }
  }
  return all
}
