# 2.0.0
The 2.0.0 release completely changes this module's internals to use Hyperspace instead of the Hyperdrive daemon.

Going forward, it's recommended to use Hyperdrive directly, using Hyperspace's `RemoteCorestore`. Check out this [blog post]() for
more details.

The main interface inside this module, `client.drives`, should behave the same in 2.0 as it did in 1.0. If you're using the other APIs,
you should be aware of these breaking changes:
* `client.fuse` has been moved into a separate module, [`@hyperspace/hyperdrive`](https://github.com/hyperspace-org/hyperdrive-service).
* `client.peersockets` has been updated to Peersockets 1.0, meaning some of the method arguments have been reordered.
