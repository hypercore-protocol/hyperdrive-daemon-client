module.exports = {
  main: {
    messages: require('./rpc/daemon/main_pb.js'),
    services: require('./rpc/daemon/main_grpc_pb.js')
  },
  fuse: {
    messages: require('./rpc/daemon/fuse_pb.js'),
    services: require('./rpc/daemon/fuse_grpc_pb.js')
  },
  drive: {
    messages: require('./rpc/daemon/drive_pb.js'),
    services: require('./rpc/daemon/drive_grpc_pb.js')
  },
  peersockets: {
    messages: require('./rpc/daemon/peersockets_pb.js'),
    services: require('./rpc/daemon/peersockets_grpc_pb.js')
  },
  peers: {
    messages: require('./rpc/daemon/peers_pb.js'),
    services: require('./rpc/daemon/peers_grpc_pb.js')
  },
  common: require('./rpc/daemon/common_pb.js')
}
