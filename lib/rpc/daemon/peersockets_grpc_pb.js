// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_peersockets_pb = require('../daemon/peersockets_pb.js');

function serialize_PeerMessage(arg) {
  if (!(arg instanceof daemon_peersockets_pb.PeerMessage)) {
    throw new Error('Expected argument of type PeerMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PeerMessage(buffer_arg) {
  return daemon_peersockets_pb.PeerMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchPeersRequest(arg) {
  if (!(arg instanceof daemon_peersockets_pb.WatchPeersRequest)) {
    throw new Error('Expected argument of type WatchPeersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchPeersRequest(buffer_arg) {
  return daemon_peersockets_pb.WatchPeersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchPeersResponse(arg) {
  if (!(arg instanceof daemon_peersockets_pb.WatchPeersResponse)) {
    throw new Error('Expected argument of type WatchPeersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchPeersResponse(buffer_arg) {
  return daemon_peersockets_pb.WatchPeersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PeersocketsService = exports.PeersocketsService = {
  join: {
    path: '/Peersockets/join',
    requestStream: true,
    responseStream: true,
    requestType: daemon_peersockets_pb.PeerMessage,
    responseType: daemon_peersockets_pb.PeerMessage,
    requestSerialize: serialize_PeerMessage,
    requestDeserialize: deserialize_PeerMessage,
    responseSerialize: serialize_PeerMessage,
    responseDeserialize: deserialize_PeerMessage,
  },
  watchPeers: {
    path: '/Peersockets/watchPeers',
    requestStream: false,
    responseStream: true,
    requestType: daemon_peersockets_pb.WatchPeersRequest,
    responseType: daemon_peersockets_pb.WatchPeersResponse,
    requestSerialize: serialize_WatchPeersRequest,
    requestDeserialize: deserialize_WatchPeersRequest,
    responseSerialize: serialize_WatchPeersResponse,
    responseDeserialize: deserialize_WatchPeersResponse,
  },
};

exports.PeersocketsClient = grpc.makeGenericClientConstructor(PeersocketsService);
