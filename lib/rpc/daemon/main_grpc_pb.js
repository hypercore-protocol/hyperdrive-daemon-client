// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_main_pb = require('../daemon/main_pb.js');

function serialize_FuseRefreshRequest(arg) {
  if (!(arg instanceof daemon_main_pb.FuseRefreshRequest)) {
    throw new Error('Expected argument of type FuseRefreshRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_FuseRefreshRequest(buffer_arg) {
  return daemon_main_pb.FuseRefreshRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_FuseRefreshResponse(arg) {
  if (!(arg instanceof daemon_main_pb.FuseRefreshResponse)) {
    throw new Error('Expected argument of type FuseRefreshResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_FuseRefreshResponse(buffer_arg) {
  return daemon_main_pb.FuseRefreshResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatusRequest(arg) {
  if (!(arg instanceof daemon_main_pb.StatusRequest)) {
    throw new Error('Expected argument of type StatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatusRequest(buffer_arg) {
  return daemon_main_pb.StatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatusResponse(arg) {
  if (!(arg instanceof daemon_main_pb.StatusResponse)) {
    throw new Error('Expected argument of type StatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatusResponse(buffer_arg) {
  return daemon_main_pb.StatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HyperdriveService = exports.HyperdriveService = {
  status: {
    path: '/Hyperdrive/status',
    requestStream: false,
    responseStream: false,
    requestType: daemon_main_pb.StatusRequest,
    responseType: daemon_main_pb.StatusResponse,
    requestSerialize: serialize_StatusRequest,
    requestDeserialize: deserialize_StatusRequest,
    responseSerialize: serialize_StatusResponse,
    responseDeserialize: deserialize_StatusResponse,
  },
  refreshFuse: {
    path: '/Hyperdrive/refreshFuse',
    requestStream: false,
    responseStream: false,
    requestType: daemon_main_pb.FuseRefreshRequest,
    responseType: daemon_main_pb.FuseRefreshResponse,
    requestSerialize: serialize_FuseRefreshRequest,
    requestDeserialize: deserialize_FuseRefreshRequest,
    responseSerialize: serialize_FuseRefreshResponse,
    responseDeserialize: deserialize_FuseRefreshResponse,
  },
};

exports.HyperdriveClient = grpc.makeGenericClientConstructor(HyperdriveService);
