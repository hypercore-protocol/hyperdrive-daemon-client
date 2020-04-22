// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_hypercore_pb = require('../daemon/hypercore_pb.js');
var daemon_common_pb = require('../daemon/common_pb.js');
var daemon_drive_pb = require('../daemon/drive_pb.js');

function serialize_AppendRequest(arg) {
  if (!(arg instanceof daemon_hypercore_pb.AppendRequest)) {
    throw new Error('Expected argument of type AppendRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_AppendRequest(buffer_arg) {
  return daemon_hypercore_pb.AppendRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_AppendResponse(arg) {
  if (!(arg instanceof daemon_hypercore_pb.AppendResponse)) {
    throw new Error('Expected argument of type AppendResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_AppendResponse(buffer_arg) {
  return daemon_hypercore_pb.AppendResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CloseSessionRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.CloseSessionRequest)) {
    throw new Error('Expected argument of type CloseSessionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CloseSessionRequest(buffer_arg) {
  return daemon_drive_pb.CloseSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CloseSessionResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.CloseSessionResponse)) {
    throw new Error('Expected argument of type CloseSessionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CloseSessionResponse(buffer_arg) {
  return daemon_drive_pb.CloseSessionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetCoreRequest(arg) {
  if (!(arg instanceof daemon_hypercore_pb.GetCoreRequest)) {
    throw new Error('Expected argument of type GetCoreRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetCoreRequest(buffer_arg) {
  return daemon_hypercore_pb.GetCoreRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetCoreResponse(arg) {
  if (!(arg instanceof daemon_hypercore_pb.GetCoreResponse)) {
    throw new Error('Expected argument of type GetCoreResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetCoreResponse(buffer_arg) {
  return daemon_hypercore_pb.GetCoreResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetRequest(arg) {
  if (!(arg instanceof daemon_hypercore_pb.GetRequest)) {
    throw new Error('Expected argument of type GetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetRequest(buffer_arg) {
  return daemon_hypercore_pb.GetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetResponse(arg) {
  if (!(arg instanceof daemon_hypercore_pb.GetResponse)) {
    throw new Error('Expected argument of type GetResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetResponse(buffer_arg) {
  return daemon_hypercore_pb.GetResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_LengthRequest(arg) {
  if (!(arg instanceof daemon_hypercore_pb.LengthRequest)) {
    throw new Error('Expected argument of type LengthRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LengthRequest(buffer_arg) {
  return daemon_hypercore_pb.LengthRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_LengthResponse(arg) {
  if (!(arg instanceof daemon_hypercore_pb.LengthResponse)) {
    throw new Error('Expected argument of type LengthResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LengthResponse(buffer_arg) {
  return daemon_hypercore_pb.LengthResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HypercoreService = exports.HypercoreService = {
  // Management methods.
get: {
    path: '/Hypercore/get',
    requestStream: false,
    responseStream: false,
    requestType: daemon_hypercore_pb.GetCoreRequest,
    responseType: daemon_hypercore_pb.GetCoreResponse,
    requestSerialize: serialize_GetCoreRequest,
    requestDeserialize: deserialize_GetCoreRequest,
    responseSerialize: serialize_GetCoreResponse,
    responseDeserialize: deserialize_GetCoreResponse,
  },
  close: {
    path: '/Hypercore/close',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.CloseSessionRequest,
    responseType: daemon_drive_pb.CloseSessionResponse,
    requestSerialize: serialize_CloseSessionRequest,
    requestDeserialize: deserialize_CloseSessionRequest,
    responseSerialize: serialize_CloseSessionResponse,
    responseDeserialize: deserialize_CloseSessionResponse,
  },
  // Hypercore operations.
length: {
    path: '/Hypercore/length',
    requestStream: false,
    responseStream: false,
    requestType: daemon_hypercore_pb.LengthRequest,
    responseType: daemon_hypercore_pb.LengthResponse,
    requestSerialize: serialize_LengthRequest,
    requestDeserialize: deserialize_LengthRequest,
    responseSerialize: serialize_LengthResponse,
    responseDeserialize: deserialize_LengthResponse,
  },
  append: {
    path: '/Hypercore/append',
    requestStream: false,
    responseStream: false,
    requestType: daemon_hypercore_pb.AppendRequest,
    responseType: daemon_hypercore_pb.AppendResponse,
    requestSerialize: serialize_AppendRequest,
    requestDeserialize: deserialize_AppendRequest,
    responseSerialize: serialize_AppendResponse,
    responseDeserialize: deserialize_AppendResponse,
  },
  getBlocks: {
    path: '/Hypercore/getBlocks',
    requestStream: false,
    responseStream: false,
    requestType: daemon_hypercore_pb.GetRequest,
    responseType: daemon_hypercore_pb.GetResponse,
    requestSerialize: serialize_GetRequest,
    requestDeserialize: deserialize_GetRequest,
    responseSerialize: serialize_GetResponse,
    responseDeserialize: deserialize_GetResponse,
  },
  //
// rpc createReadStream (ReadStreamRequest) returns (stream ReadStreamResponse);
// rpc createWriteStream (stream WriteStreamRequest) returns (WriteStreamResponse);
};

exports.HypercoreClient = grpc.makeGenericClientConstructor(HypercoreService);
