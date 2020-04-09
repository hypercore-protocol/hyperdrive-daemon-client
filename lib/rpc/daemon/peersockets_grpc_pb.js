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
};

exports.PeersocketsClient = grpc.makeGenericClientConstructor(PeersocketsService);
