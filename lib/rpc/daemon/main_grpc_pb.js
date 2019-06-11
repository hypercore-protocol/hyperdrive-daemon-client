// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var daemon_main_pb = require('../daemon/main_pb.js');

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

function serialize_StopRequest(arg) {
  if (!(arg instanceof daemon_main_pb.StopRequest)) {
    throw new Error('Expected argument of type StopRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StopRequest(buffer_arg) {
  return daemon_main_pb.StopRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StopResponse(arg) {
  if (!(arg instanceof daemon_main_pb.StopResponse)) {
    throw new Error('Expected argument of type StopResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StopResponse(buffer_arg) {
  return daemon_main_pb.StopResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HyperdriveService = exports.HyperdriveService = {
  stop: {
    path: '/Hyperdrive/stop',
    requestStream: false,
    responseStream: false,
    requestType: daemon_main_pb.StopRequest,
    responseType: daemon_main_pb.StopResponse,
    requestSerialize: serialize_StopRequest,
    requestDeserialize: deserialize_StopRequest,
    responseSerialize: serialize_StopResponse,
    responseDeserialize: deserialize_StopResponse,
  },
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
};

exports.HyperdriveClient = grpc.makeGenericClientConstructor(HyperdriveService);
