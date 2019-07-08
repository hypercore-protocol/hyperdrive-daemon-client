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

### Hyperdrive
The client's Hyperdrive API is designed to mirror the methods in Hyperdrive as closely as possible. 

#### Session Operations

##### `test`
Blah

#### Drive-specific Operations

Check out the [daemon tests](https://github.com/andrewosh/hyperdrive-daemon/blob/hyperdrive-api/test/hyperdrive.js) for more example usage.

## License
MIT
