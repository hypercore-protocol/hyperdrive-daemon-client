// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_peers_pb = require('../daemon/peers_pb.js');

function serialize_GetAliasRequest(arg) {
  if (!(arg instanceof daemon_peers_pb.GetAliasRequest)) {
    throw new Error('Expected argument of type GetAliasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetAliasRequest(buffer_arg) {
  return daemon_peers_pb.GetAliasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetAliasResponse(arg) {
  if (!(arg instanceof daemon_peers_pb.GetAliasResponse)) {
    throw new Error('Expected argument of type GetAliasResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetAliasResponse(buffer_arg) {
  return daemon_peers_pb.GetAliasResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetKeyRequest(arg) {
  if (!(arg instanceof daemon_peers_pb.GetKeyRequest)) {
    throw new Error('Expected argument of type GetKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetKeyRequest(buffer_arg) {
  return daemon_peers_pb.GetKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetKeyResponse(arg) {
  if (!(arg instanceof daemon_peers_pb.GetKeyResponse)) {
    throw new Error('Expected argument of type GetKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetKeyResponse(buffer_arg) {
  return daemon_peers_pb.GetKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchPeersRequest(arg) {
  if (!(arg instanceof daemon_peers_pb.WatchPeersRequest)) {
    throw new Error('Expected argument of type WatchPeersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchPeersRequest(buffer_arg) {
  return daemon_peers_pb.WatchPeersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchPeersResponse(arg) {
  if (!(arg instanceof daemon_peers_pb.WatchPeersResponse)) {
    throw new Error('Expected argument of type WatchPeersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchPeersResponse(buffer_arg) {
  return daemon_peers_pb.WatchPeersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PeersService = exports.PeersService = {
  getKey: {
    path: '/Peers/getKey',
    requestStream: false,
    responseStream: false,
    requestType: daemon_peers_pb.GetKeyRequest,
    responseType: daemon_peers_pb.GetKeyResponse,
    requestSerialize: serialize_GetKeyRequest,
    requestDeserialize: deserialize_GetKeyRequest,
    responseSerialize: serialize_GetKeyResponse,
    responseDeserialize: deserialize_GetKeyResponse,
  },
  getAlias: {
    path: '/Peers/getAlias',
    requestStream: false,
    responseStream: false,
    requestType: daemon_peers_pb.GetAliasRequest,
    responseType: daemon_peers_pb.GetAliasResponse,
    requestSerialize: serialize_GetAliasRequest,
    requestDeserialize: deserialize_GetAliasRequest,
    responseSerialize: serialize_GetAliasResponse,
    responseDeserialize: deserialize_GetAliasResponse,
  },
  watchPeers: {
    path: '/Peers/watchPeers',
    requestStream: false,
    responseStream: true,
    requestType: daemon_peers_pb.WatchPeersRequest,
    responseType: daemon_peers_pb.WatchPeersResponse,
    requestSerialize: serialize_WatchPeersRequest,
    requestDeserialize: deserialize_WatchPeersRequest,
    responseSerialize: serialize_WatchPeersResponse,
    responseDeserialize: deserialize_WatchPeersResponse,
  },
};

exports.PeersClient = grpc.makeGenericClientConstructor(PeersService);
