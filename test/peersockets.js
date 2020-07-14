const test = require('tape')
const hypercoreCrypto = require('hypercore-crypto')
const { create } = require('./util/create')

test('peersockets, unidirectional send one', async t => {
  const { clients, hsClients, cleanup } = await create(2)
  const firstClient = clients[0]
  const secondClient = clients[1]

  const secondKey = hsClients[1].network.keyPair.publicKey
  let received = false

  const sharedKey = hypercoreCrypto.randomBytes(32)

  try {
    await hsClients[0].network.configure(sharedKey, { lookup: true, announce: true })
    await hsClients[1].network.configure(sharedKey, { lookup: false, announce: true })

    // 100 ms delay for swarming.
    await delay(100)

    // The two peers should be swarming now.
    const firstTopic = firstClient.peersockets.join('my-topic', {
      onmessage: (msg, peer) => {
        t.true(peer.remotePublicKey.equals(secondKey))
        t.same(msg, Buffer.from('hello peersockets!'))
        received = true
      }
    })
    const secondTopic = secondClient.peersockets.join('my-topic')
    secondTopic.send('hello peersockets!', hsClients[1].network.peers[0])

    // 100 ms delay for the message to be sent.
    await delay(100)

    firstTopic.close()
    secondTopic.close()
  } catch (err) {
    t.fail(err)
  }

  t.true(received)
  await cleanup()
  t.end()
})

test('peersockets, unidirectional send many', async t => {
  const { clients, hsClients, cleanup } = await create(2)
  const firstClient = clients[0]
  const secondClient = clients[1]

  const secondKey = hsClients[1].network.keyPair.publicKey
  const sharedKey = hypercoreCrypto.randomBytes(32)

  await hsClients[0].network.configure(sharedKey, { announce: true, lookup: true })
  await hsClients[1].network.configure(sharedKey, { announce: false, lookup: true })

  // 100 ms delay for discovery.
  await delay(100)

  let received = 0
  const msgs = ['first', 'second', 'third', 'fourth', 'fifth'].map(s => Buffer.from(s))

  try {
    // The two peers should be swarming now.
    const firstTopic = firstClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(secondKey))
        t.true(msg.equals(msgs[received++]))
      }
    })
    const secondTopic = secondClient.peersockets.join('my-topic')
    for (const msg of msgs) {
      secondTopic.send(msg, hsClients[1].network.peers[0])
    }

    // 100 ms delay for the message to be send.
    await delay(100)

    firstTopic.close()
    secondTopic.close()
  } catch (err) {
    t.fail(err)
  }

  t.same(received, msgs.length)
  await cleanup()
  t.end()
})

test('peersockets, bidirectional send one', async t => {
  const { clients, hsClients, cleanup } = await create(2)
  const firstClient = clients[0]
  const secondClient = clients[1]

  const firstKey = hsClients[0].network.keyPair.publicKey
  const secondKey = hsClients[1].network.keyPair.publicKey
  const sharedKey = hypercoreCrypto.randomBytes(32)

  await hsClients[0].network.configure(sharedKey, { announce: true, lookup: true })
  await hsClients[1].network.configure(sharedKey, { announce: false, lookup: true })

  // 100 ms delay for discovery.
  await delay(100)

  let receivedFirst = false
  let receivedSecond = false

  try {
    const msg1 = Buffer.from('hello peersockets!')
    const msg2 = Buffer.from('hello right back to ya')

    // The two peers should be swarming now.
    const firstTopic = firstClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(secondKey))
        t.true(msg.equals(msg1))
        firstTopic.send(msg2, peer)
        receivedFirst = true
      }
    })
    const secondTopic = secondClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(firstKey))
        t.true(msg.equals(msg2))
        receivedSecond = true
      }
    })

    secondTopic.send(msg1, hsClients[1].network.peers[0])

    // 100 ms delay for the message to be send.
    await delay(100)

    firstTopic.close()
    secondTopic.close()
  } catch (err) {
    t.fail(err)
  }

  t.true(receivedFirst)
  t.true(receivedSecond)
  await cleanup()
  t.end()
})

test('peersockets, bidirectional send many', async t => {
  const { clients, hsClients, cleanup } = await create(2)
  const firstClient = clients[0]
  const secondClient = clients[1]

  const firstKey = hsClients[0].network.keyPair.publicKey
  const secondKey = hsClients[1].network.keyPair.publicKey
  const sharedKey = hypercoreCrypto.randomBytes(32)

  await hsClients[0].network.configure(sharedKey, { announce: true, lookup: true })
  await hsClients[1].network.configure(sharedKey, { announce: false, lookup: true })

  // 100 ms delay for discovery.
  await delay(100)

  let firstReceived = 0
  let secondReceived = 0
  const firstMsgs = ['first', 'second', 'third', 'fourth', 'fifth'].map(s => Buffer.from(s))
  const secondMsgs = ['first-reply', 'second-reply', 'third-reply', 'fourth-reply', 'fifth-reply'].map(s => Buffer.from(s))

  try {
    const firstTopic = firstClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(secondKey))
        t.true(msg.equals(firstMsgs[firstReceived]))
        firstTopic.send(secondMsgs[firstReceived++], peer)
      }
    })
    const secondTopic = secondClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(firstKey))
        t.true(msg.equals(secondMsgs[secondReceived++]))
      }
    })

    for (const msg of firstMsgs) {
      secondTopic.send(msg, hsClients[1].network.peers[0])
    }

    // 100 ms delay for the message to be send.
    await delay(100)

    firstTopic.close()
    secondTopic.close()
  } catch (err) {
    t.fail(err)
  }

  t.same(firstReceived, firstMsgs.length)
  t.same(secondReceived, secondMsgs.length)
  await cleanup()
  t.end()
})

test('peersockets, send to all peers swarming a drive, static peers', async t => {
  const NUM_PEERS = 10

  const { clients, hsClients, cleanup } = await create(NUM_PEERS)
  const firstClient = clients[0]
  const firstRemoteKey = hsClients[0].network.keyPair.publicKey
  const store = hsClients[0].corestore()
  const sharedCore = store.get()
  await sharedCore.ready()

  await hsClients[0].network.configure(sharedCore.discoveryKey, { announce: true, lookup: true })

  const received = (new Array(NUM_PEERS - 1)).fill(0)
  const msgs = ['hello', 'world'].map(s => Buffer.from(s))

  try {
    const receivers = []
    const receiverTopics = []

    // The first peer joins the topic immediately
    const firstTopic = firstClient.peersockets.join('my-topic')

    // Start observing all peers that swarm the drive's discovery key.
    const unwatch = await firstClient.peers.watchPeers(sharedCore.key, {
      onjoin: (peer) => {
        receivers.push(peer)
      },
      onleave: (peer) => {
        receivers.splice(receivers.indexOf(peer), 1)
      }
    })

    // Each receiver peers swarms the shared core and joins the topic.
    for (let i = 1; i < NUM_PEERS; i++) {
      const store = hsClients[i].corestore()
      const core = store.get(sharedCore.key)
      await core.ready()
      await hsClients[i].network.configure(sharedCore.discoveryKey, { announce: false, lookup: true })
      receiverTopics.push(clients[i].peersockets.join('my-topic', {
        onmessage: async (msg, peer) => {
          t.true(peer.remotePublicKey.equals(firstRemoteKey))
          t.true(msg.equals(msgs[received[i - 1]++]))
        }
      }))
    }

    // All the clients should be swarming now
    await delay(1000)

    for (const msg of msgs) {
      for (const peer of receivers) {
        firstTopic.send(msg, peer)
      }
    }

    // 1000 ms delay for all messages to be sent.
    await delay(1000)

    await unwatch()
    firstTopic.close()
    for (const topic of receiverTopics) {
      topic.close()
    }
  } catch (err) {
    t.fail(err)
  }

  for (const count of received) {
    t.same(count, msgs.length)
  }
  await cleanup()
  t.end()
})

// TODO: There's a nondeterministic failure here on slow machines. Investigate.
test('peersockets, send to all peers swarming a drive, dynamically-added peers', async t => {
  const NUM_PEERS = 10

  const { clients, hsClients, cleanup } = await create(NUM_PEERS)
  const firstClient = clients[0]
  const firstRemoteKey = hsClients[0].network.keyPair.publicKey

  const received = (new Array(NUM_PEERS - 1)).fill(0)
  const firstMessage = Buffer.from('hello world')

  try {
    const store = hsClients[0].corestore()
    const sharedCore = store.get()
    await sharedCore.ready()
    await hsClients[0].network.configure(sharedCore.key, { announce: true, lookup: true })
    const receivers = []
    const receiverTopics = []

    // The first peer joins the topic immediately
    const firstTopic = firstClient.peersockets.join('my-topic')

    // Start observing all peers that swarm the drive's discovery key.
    const unwatch = await firstClient.peers.watchPeers(sharedCore.key, {
      onjoin: (peer) => {
        firstTopic.send(firstMessage, peer)
        receivers.push(peer)
      },
      onleave: (peer) => {
        receivers.splice(receivers.indexOf(peer), 1)
      }
    })

    // Each receiver peers swarms the drive and joins the topic.
    // Wait between each peer creation to test dynamic joins.
    for (let i = 1; i < NUM_PEERS; i++) {
      const store = hsClients[i].corestore()
      store.get(sharedCore.key)
      await hsClients[i].network.configure(sharedCore.key, { announce: false, lookup: true })
      receiverTopics.push(clients[i].peersockets.join('my-topic', {
        onmessage: async (msg, peer) => {
          t.true(peer.remotePublicKey.equals(firstRemoteKey))
          t.true(msg.equals(firstMessage))
          received[i - 1]++
        }
      }))
      await delay(50)
    }

    await unwatch()
    await firstTopic.close()
    for (const topic of receiverTopics) {
      await topic.close()
    }
  } catch (err) {
    t.fail(err)
  }

  for (const count of received) {
    t.same(count, 1)
  }
  await cleanup()
  t.end()
})

// This test is no longer valid (the user should explicitly leave the topic now).
test.skip('closing the last topic handle closes the topic', async t => {
  const { clients, hsClients, cleanup } = await create(2)
  const firstClient = clients[0]
  const secondClient = clients[1]

  const firstPeersockets = clients[0].peersockets
  const secondKey = hsClients[1].network.keyPair.publicKey
  let received = false

  const sharedKey = hypercoreCrypto.randomBytes(32)

  try {
    await hsClients[0].network.configure(sharedKey, { announce: true, lookup: true })
    await hsClients[1].network.configure(sharedKey, { announce: false, lookup: true })

    // 100 ms delay for swarming.
    await delay(100)

    // The two peers should be swarming now.
    const firstTopic = firstClient.peersockets.join('my-topic', {
      onmessage: async (msg, peer) => {
        t.true(peer.remotePublicKey.equals(secondKey))
        t.same(msg, Buffer.from('hello peersockets!'))
        received = true
      }
    })
    const secondTopic = secondClient.peersockets.join('my-topic')
    secondTopic.send('hello peersockets!', hsClients[1].network.peers[0])

    // 100 ms delay for the message to be sent.
    await delay(100)

    // The topic should still be registered on the connection.
    t.same(firstPeersockets.topicsByName.size, 1)

    await firstTopic.close()
    await secondTopic.close()
  } catch (err) {
    t.fail(err)
  }

  // Delay for topics to be closed
  await delay(100)

  t.true(received)
  t.same(firstPeersockets.topicsByName.size, 0)

  await cleanup()
  t.end()
})

function delay (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
