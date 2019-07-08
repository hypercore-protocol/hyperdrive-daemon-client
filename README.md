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
- `hash`: A root tree hash that will be used for validation (_Note: Currently not implemented_).

Returns:
- `id`: A session ID that can be used in subsequent drive-specific commands.
- `info`: Drive info that can include:
   - `key`: The Hyperdrive key
   - `version`: The Hyperdrive version
   
##### `await client.drive.close(sessionId)`
Close a session that was previously opened with `get`.

##### `await client.drive.publish(sessionId)`
Advertise a drive (corresponding to a session) on the network.

#### `await client.drive.unpublish(sessionId)`
Stop advertising a drive (corresponding to a session) on the network.

#### Drive-specific Operations
The client currently only supports a subset of the Hyperdrive API. We're actively working on extending this (with the end-goal being complete parity)! Method arguments take the same form as those in Hyperdrive. The following methods are supported now:
1. `await client.drive.writeFile(sessionId, path, content)`
2. `const contents = await client.drive.readFile(sessionId, path)`
3. `const mountInfo = await client.drive.mount(sessionId, path, mountOpts)`
4. `const fileList = await client.drive.readdir(sessionId, dirName, readdirOpts)`
5. `const stat = await client.drive.stat(sessionId, path)`

### FUSE

## License
MIT
