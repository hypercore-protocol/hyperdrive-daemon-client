# hyperdrive-daemon-client
A Node client library and CLI tool for interacting with the Hyperdrive daemon.

Implements the RPC methods defined in the [`hyperdrive-schemas`](https://github.com/andrewosh/hyperdrive-schemas) repo.

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

#### General Operations
Operations to manage sessions or get more general information about the state of the daemon.

##### `const { info, id } = await client.drive.get(opts)`
Creates a Hyperdrive using the provided drive options (if one has not previously been created), then opens a session for that drive.

Options can include:
- `key`: The key of an existing Hyperdrive
- `version`: The version of the drive (this will create a checkout).
- `hash`: A root tree hash that will be used for validation (_Note: currently unimplemented_).

Returns:
- `id`: A session ID that can be used in subsequent drive-specific commands.
- `info`: Drive info that can include:
   - `key`: The Hyperdrive key
   - `version`: The Hyperdrive version
   
##### `const allStats = await client.drive.allStats()`
Get networking statistics for all drives being actively managed by the daemon. The returned object is a list of stats results of the form described below.
   
#### Session-specific Operations
Each of the following is not a Hyperdrive method, but applies only to a single session.

##### `await client.drive.close(sessionId)`
Close a session that was previously opened with `get`.

##### `const stats = await client.drive.stats(sessionId)`
Get networking statistics for a drive.

The returned statistics will be a list of stats per-mount, with top-level statistics contained in the entry for the '/' mount, eg:
```
[{ path: '/', metadata: { ... }, content: { ... } }, { path: '/a', metadata: { ... }, content: { ... } }, ... ]
```

##### `await client.drive.publish(sessionId)`
Advertise a drive (corresponding to a session) to the network.

##### `await client.drive.unpublish(sessionId)`
Stop advertising a drive (corresponding to a session) to the network.

#### Drive-specific Operations
The client currently only supports a subset of the Hyperdrive API. We're actively working on extending this (targeting complete parity)! Each method's options mirror those in the [hyperdrive module](https://github.com/mafintosh/hyperdrive).

Each method returns a Promise, but can optionally take a callback (to more accurately reflect the Hyperdrive API).

Method arguments take the same form as those in Hyperdrive, with the addition of the session ID. The following methods are supported as of now:

1. `client.drive.createWriteStream(sessionId, path, opts)`
2. `client.drive.writeFile(sessionId, path, content, cb(err))`
3. `client.drive.createReadStream(sessionId, path, opts)`
4. `client.drive.readFile(sessionId, path, cb(err, content))`
5. `client.drive.mount(sessionId, path, mountOpts, cb(err, mountInfo)`
6. `client.drive.unmount(sessionId, path, cb(err))`
7. `client.drive.readdir(sessionId, dirName, readdirOpts, cb(err, fileList))`
8. `client.drive.stat(sessionId, path, cb(err, stat))`
9. `client.drive.watch(sessionId, path, function onwatch () {})`
10. `client.drive.mkdir(sessionId, dirName, opts, cb(err)`
11. `client.drive.rmdir(sessionId, dirName, cb(err)`

### FUSE
The client library also provides programmatic access to the daemon's FUSE interface. You can mount/unmount your root drive, or mount and share subdrives:

##### `client.fuse.mount(mnt, opts, cb)`
Mount either the root drive (if `/mnt` is not specified), or a subdirectory within the root drive.
- `mnt`: The mountpoint of the drive (currently enforced to be `/hyperdrive` if it's the root drive, and a subdirectory within `/hyperdrive/home` otherwise.
- `opts`: Hyperdrive mount options (identical to those in Hyperdrive).

##### `client.fuse.unmount(mnt, cb)`
Unmounts either a subdrive, or the root drive if `mnt` is not specified.

##### `client.fuse.publish(path, cb)`
Advertise the drive mounted at `path` to the network.

##### `client.fuse.unpublish(path, cb)`
Stop advertisingthe drive mounted at `path` to the network.

## License
MIT
