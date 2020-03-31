const { Command } = require('@oclif/command')

const { HyperdriveClient } = require('../..')

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

class StatusCommand extends Command {
  static description = 'Check the status of the Hyperdrive daemon.'
  static usage = 'status'

  async run () {
    try {
      const client = new HyperdriveClient()
      await client.ready()
      const status = await client.status()
      console.log(`The Hyperdrive daemon is running:`)
      console.log()
      console.log(`  API Version:             ${status.apiVersion}`)
      console.log(`  Daemon Version:          ${status.daemonVersion}`)
      console.log(`  Client Version:          ${status.clientVersion}`)
      console.log(`  Schema Version:          ${status.schemaVersion}`)
      console.log(`  Hyperdrive Version:      ${status.hyperdriveVersion}`)
      console.log(`  Fuse Native Version:     ${status.fuseNativeVersion}`)
      console.log(`  Hyperdrive Fuse Version: ${status.hyperdriveFuseVersion}`)
      console.log()
      console.log(`  Holepunchable:           ${status.holepunchable}`)
      console.log(`  Remote Address:          ${status.remoteAddress}`)
      console.log()
      console.log(`  Fuse Available:          ${status.fuseAvailable}`)
      console.log(`  Fuse Configured:         ${status.fuseConfigured}`)
      console.log()
      console.log(`  Uptime:                  ${runningTime(status.uptime)}`)
    } catch (err) {
      if (err.disconnected) {
        console.error('The Hyperdrive daemon is not running.')
      } else {
        console.error(`Could not get the daemon status:`)
        console.error(`${err.details || err}`)
      }
      this.exit(1)
    }
    this.exit()
  }
}

module.exports = StatusCommand

function runningTime (uptime) {
  const days = Math.floor(uptime / DAY)
  const hours = Math.floor((uptime - (days * DAY)) / HOUR)
  const minutes = Math.floor((uptime - (days * DAY) - (hours * HOUR)) / MINUTE)
  const seconds = Math.floor((uptime - (days * DAY) - (hours * HOUR) - (minutes * MINUTE)) / SECOND)
  return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
}
