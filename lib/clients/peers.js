const maybe = require('call-me-maybe')

module.exports = class PeersClient {
  constructor (client) {
    this.client = client
  }

  async _listPeers (key) {
    const store = this.client.corestore()
    const core = store.get(key)
    await core.ready()
    const peers = core.peers
    await store.close()
    return peers
  }

  listPeers (key, cb) {
    return maybe(cb, this._listPeers(key))
  }

  async watchPeers (key, opts = {}) {
    const store = this.client.corestore()
    const core = store.get(key)
    await core.ready()
    var joinListener, leaveListener

    if (opts.onjoin) {
      for (const peer of core.peers) {
        opts.onjoin(peer)
      }
      joinListener = peer => {
        opts.onjoin(peer)
      }
      core.on('peer-add', joinListener)
    }

    if (opts.onleave) {
      leaveListener = peer => {
        opts.onleave(peer)
      }
      core.on('peer-remove', leaveListener)
    }

    return async () => {
      if (joinListener) core.removeListener('peer-add', joinListener)
      if (leaveListener) core.removeListener('peer-remove', leaveListener)
      await store.close()
    }
  }
}
