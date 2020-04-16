// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_debug_pb = require('../daemon/debug_pb.js');

function serialize_ReplMessage(arg) {
  if (!(arg instanceof daemon_debug_pb.ReplMessage)) {
    throw new Error('Expected argument of type ReplMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReplMessage(buffer_arg) {
  return daemon_debug_pb.ReplMessage.deserializeBinary(new Uint8Array(buffer_arg));
}


var DebugService = exports.DebugService = {
  repl: {
    path: '/Debug/repl',
    requestStream: true,
    responseStream: true,
    requestType: daemon_debug_pb.ReplMessage,
    responseType: daemon_debug_pb.ReplMessage,
    requestSerialize: serialize_ReplMessage,
    requestDeserialize: deserialize_ReplMessage,
    responseSerialize: serialize_ReplMessage,
    responseDeserialize: deserialize_ReplMessage,
  },
};

exports.DebugClient = grpc.makeGenericClientConstructor(DebugService);
