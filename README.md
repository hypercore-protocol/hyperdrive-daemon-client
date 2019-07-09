# hyperdrive-daemon-client
A Node client library and CLI tool for interacting with the Hyperdrive daemon.

## Installation
`npm i hyperdrive-daemon-client --save`

## Usage
This module provides both programmatic and CLI access to the [Hyperdrive daemon](https://github.com/andrewosh/hyperdrive-daemon). For info about how to use the CLI, take a look at README in the daemon repo.

Each client takes an optional gRPC endpoint and access token as constructor arguments:
```js
const HyperdriveClient = require('hyperdrive-daemon-client')
const client = new HyperdriveClient('localhost:3101', 'your_access_token')
```

If you're running the client and the daemon on the same machine, the endpoint/token can be read from a common location (by default, `~/.hyperdrive`). If the arguments are not provided, then they will be read from this file (which is created by the daemon).

All Hyperdrive API methods are accessed through `client.drive`, and all FUSE methods through `client.fuse`.

## API
The client exposes a gRPC interface for a) creating and interacting with remote Hyperdrives and b) mounting Hyperdrives as local directories using FUSE.

Check out the [daemon tests](https://github.com/andrewosh/hyperdrive-daemon/blob/hyperdrive-api/test/hyperdrive.js) for more example usage.

### Hyperdrive
The client's Hyperdrive API is designed to mirror the methods in Hyperdrive as closely as possible. 

#### Session Operations

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
   
##### `await client.drive.close(sessionId)`
Close a session that was previously opened with `get`.

##### `await client.drive.publish(sessionId)`
Advertise a drive (corresponding to a session) to the network.

#### `await client.drive.unpublish(sessionId)`
Stop advertising a drive (corresponding to a session) to the network.

#### Drive-specific Operations
The client currently only supports a subset of the Hyperdrive API. We're actively working on extending this (targeting complete parity)! 

Method arguments take the same form as those in Hyperdrive. The following methods are supported now:
1. `client.drive.writeFile(sessionId, path, content, cb(err))`
2. `client.drive.readFile(sessionId, path, cb(err, content))`
3. `client.drive.mount(sessionId, path, mountOpts, cb(err, mountInfo)`
4. `client.drive.readdir(sessionId, dirName, readdirOpts, cb(err, fileList))`
5. `client.drive.stat(sessionId, path, cb(err, stat))`

### FUSE
The client library also provides programmatic access to the daemon's FUSE interface. You can mount/unmount your root drive, or mount and share subdrives:

##### `client.fuse.mount(mnt, opts, cb)`
Mount either the root drive (if `/mnt` is not specified), or a subdirectory within the root drive.
- `mnt`: The mountpoint of the drive (currently enforced to be `/hyperdrive` if it's the root drive, and a subdirectory within `/hyperdrive/home` otherwise.
- `opts`: Hyperdrive mount options (identical to those in Hyperdrive).

##### `client.fuse.unmount(cb)`
Unmounts the root drive.

##### `client.fuse.publish(path, cb)`
Advertise the drive mounted at `path` to the network.

##### `client.fuse.unpublish(path, cb)`
Stop advertisingthe drive mounted at `path` to the network.

## License
MIT
