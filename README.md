# `hyperdrive-daemon-client`
[![Build Status](https://travis-ci.com/hypercore-protocol/hyperdrive-daemon-client.svg?branch=hyperspace-port)](https://travis-ci.com/hypercore-protocol/hyperdrive-daemon-client)

> A Node client library and CLI tool for interacting with the Hyperdrive daemon.

## ⚠️ Soft Deprecation Notice ⚠️
__With the introduction of [`hyperspace`](https://github.com/hyperspace-org/hyperspace), this module is "soft deprecated," meaning the current compat release (v2) will likely be the last.__

__If you're a new user, it's recommended to use [`hyperdrive`](https://github.com/hypercore-protocol/hyperdrive) directly, using a `RemoteCorestore` instance connected to Hyperspace. Check out the Hyperspace docs for examples.__

__For existing users, the most recent update (v2) works with Hyperspace, and is designed to replicate the v1 functionality with minimal breaking changes. See [`UPGRADE.md`](https://github.com/hypercore-protocol/hyperdrive-daemon-client/blob/master/UPGRADE.md) for more info.__

## Installation
`npm i hyperdrive-daemon-client --save`

## Usage
This module provides both programmatic and CLI access to the [Hyperdrive daemon](https://github.com/andrewosh/hyperdrive-daemon). For info about how to use the CLI, take a look at README in the daemon repo.

Each client takes an optional gRPC endpoint and access token as constructor arguments:
```js
const { HyperdriveClient } = require('hyperdrive-daemon-client')
const client = new HyperdriveClient('localhost:3101', 'your_access_token')
```

If you're running the client and the daemon on the same machine, the endpoint/token can be read from a common location (by default, `~/.hyperdrive`). If the arguments are not provided, then they will be read from this file (which is created by the daemon).

All Hyperdrive API methods are accessed through `client.drive`, and all FUSE methods through `client.fuse`.

## API
The client exposes a gRPC interface for a) creating and interacting with remote Hyperdrives and b) mounting Hyperdrives as local directories using FUSE.

Check out the [daemon tests](https://github.com/andrewosh/hyperdrive-daemon/blob/hyperdrive-api/test/hyperdrive.js) for more example usage.

### Hyperdrive
The client's Hyperdrive API is designed to mirror the methods in Hyperdrive as closely as possible.

All drive commands can be found through the `client.drives` object.

#### General Operations
Operations to manage sessions or get more general information about the state of the daemon.

##### `const drive = await client.drive.get(opts)`
Creates a Hyperdrive using the provided drive options (if one has not previously been created), then opens a session for that drive.

Options can include:
- `key`: The key of an existing Hyperdrive
- `version`: The version of the drive (this will create a checkout).
- `hash`: A root tree hash that will be used for validation (_Note: currently unimplemented_).

Returns:
- `drive`: A remote Hyperdrive instance that can be used for subsequent drive-specific commands.
   
##### `const allStats = await client.drive.allStats()`
Get networking statistics for all drives being actively managed by the daemon. The returned object is a list of stats results of the form described below.
   
#### Drive-specific Operations
Each of the following is not a Hyperdrive method, but applies only to a single session.

##### `await drive.close()`
Close a remote drive's underlying session.

If there are no sessions open for a drive, and it isn't being used by FUSE, then the drive will be closed inside the daemon. Remember to close sessions, else you'll leak memory!

##### `const stats = await drive.stats()`
Get networking statistics for a drive.

The returned statistics will be a list of stats per-mount, with top-level statistics contained in the entry for the '/' mount, eg:
```
[{ path: '/', metadata: { ... }, content: { ... } }, { path: '/a', metadata: { ... }, content: { ... } }, ... ]
```

##### `await drive.configureNetwork(opts = {})`
Change a drive's networking configuration.

Options include:
```js
{
  announce: true, // Announce the drive's discovery key.
  lookup: true,   // Look up peers that are announcing the drive's discovery key.
  remember: true  // Save these settings so that they'll apply across daemon restarts.
}
```

#### Hyperdrive Methods
The client currently only supports a subset of the Hyperdrive API. We're actively working on extending this (targeting complete parity)! Each method's options mirror those in the [hyperdrive module](https://github.com/mafintosh/hyperdrive).

Each method returns a Promise, but can optionally take a callback (to more accurately reflect the Hyperdrive API).

Method arguments take the same form as those in Hyperdrive. The following methods are supported as of now:

1. `drive.createWriteStream(path, opts)`
2. `drive.writeFile(path, content, cb(err))`
3. `drive.createReadStream(path, opts)`
4. `drive.readFile(path, cb(err, content))`
5. `drive.mount(path, mountOpts, cb(err, mountInfo)`
6. `drive.unmount(path, cb(err))`
7. `drive.readdir(dirName, readdirOpts, cb(err, fileList))`
8. `drive.stat(path, cb(err, stat))`
9. `drive.watch(path, function onwatch () {})`
10. `drive.mkdir(dirName, opts, cb(err)`
11. `drive.rmdir(dirName, cb(err)`
12. `drive.unlink(path, cb(err))`
13. `drive.symlink(target, linkname, cb(err))`
14. `drive.version(cb(err, version))`
15. `drive.download(path, opts, cb)`
16. `drive.createDiffStream(other, prefix)`
17. `drive.updateMetadata(path, metadata, cb(err))`
18. `drive.deleteMetadata(path, metadata, cb(err))`
19. `drive.fileStats(name, cb(err, stats))`
20. `drive.checkout(version)` // Returns a new `RemoteHyperdrive` instance for the checkout.

### FUSE
The client library also provides programmatic access to the daemon's FUSE interface.

All FUSE commands can be found on the `client.fuse` object.

##### `client.fuse.mount(mnt, opts, cb)`
Mount either the root drive (if `/mnt` is not specified), or a subdirectory within the root drive.
- `mnt`: The mountpoint of the drive (currently enforced to be `~/Hyperdrive` if it's the root drive, and a subdirectory within `~/Hyperdrive` otherwise.
- `opts`: Hyperdrive mount options (identical to those in Hyperdrive).

##### `client.fuse.unmount(mnt, cb)`
Unmounts either a subdrive, or the root drive if `mnt` is not specified.

##### `client.fuse.publish(path, cb)`
Advertise the drive mounted at `path` to the swarm.

##### `client.fuse.unpublish(path, cb)`
Stop advertising the drive mounted at `path` to the swarm.

### Peersockets
`client.peersockets` lets your directly exchange messages with connected peers. You can discover all peers swarming a given discovery key using the peers API (`client.peers`) described below.

Peers are all identified by aliases in order to reduce bandwidth consumtion, as the alternative is to attach NOISE keys to every message. Aliases can be mapped to/from NOISE keys through the `client.peers` API.

##### `const topicHandle = client.peersockets.join(topicName, { onmessage })`
- `topicName`: A String
- `onmessage`: A function of the form `(alias, msg) => { ... }`
Create a TopicHandle for sending/receiving messages on topic `topicName`.

##### `topicHandle.send(alias, msg)`
- `alias`: A numeric peer alias
- `msg`: A Buffer

Attempt to send a message on the handle's topic to the given peer. 

This message will be delivered with best-effort, but if the remote peer is not subscribed to the topic the message will silently be discarded.

##### `topicHandle.on('close', ...)`
Emitted when the topic stream has closed.

You can check out the internals in the [peersockets repo](https://github.com/andrewosh/peersockets).

### Peers
`client.peers` allows you to get information about currently-connected peers.

##### `const peerList = await client.peers.listPeers([discoveryKey])`
- `discoveryKey`: A Buffer

Get the list of connected peers either globally or swarming a specific discovery key.

`peerList` has the form:
```js
[
  {
    noiseKey: 0x123...
    address: '10.21...`,
    type: 'utp'|'tcp'
  },
  ...
]
```

##### `const destroy = client.peers.watchPeers([discoveryKey], { onjoin, onleave })`
- `discoveryKey`: A Buffer

Watch for peers joining or leaving either globally or for a specific discovery key.

`onjoin` and `onleave` both take a single `peer` argument with `{ noiseKey, address, type }` fields.

##### `const alias = await client.peers.getAlias(key)`
Gets or creates a numeric alias for the given NOISE `key`.

##### `const key = await client.peers.getKey(alias)`
Returns the NOISE `key` for a previously-assigned `alias`.

## License
MIT
