// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var daemon_drive_pb = require('../daemon/drive_pb.js');
var daemon_common_pb = require('../daemon/common_pb.js');
var hyperdrive_pb = require('../hyperdrive_pb.js');

function serialize_GetDriveRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.GetDriveRequest)) {
    throw new Error('Expected argument of type GetDriveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetDriveRequest(buffer_arg) {
  return daemon_drive_pb.GetDriveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetDriveResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.GetDriveResponse)) {
    throw new Error('Expected argument of type GetDriveResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetDriveResponse(buffer_arg) {
  return daemon_drive_pb.GetDriveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ListRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ListRequest)) {
    throw new Error('Expected argument of type ListRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ListRequest(buffer_arg) {
  return daemon_drive_pb.ListRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ListResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ListResponse)) {
    throw new Error('Expected argument of type ListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ListResponse(buffer_arg) {
  return daemon_drive_pb.ListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadFileRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadFileRequest)) {
    throw new Error('Expected argument of type ReadFileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadFileRequest(buffer_arg) {
  return daemon_drive_pb.ReadFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadFileResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadFileResponse)) {
    throw new Error('Expected argument of type ReadFileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadFileResponse(buffer_arg) {
  return daemon_drive_pb.ReadFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.StatRequest)) {
    throw new Error('Expected argument of type StatRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatRequest(buffer_arg) {
  return daemon_drive_pb.StatRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.StatResponse)) {
    throw new Error('Expected argument of type StatResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatResponse(buffer_arg) {
  return daemon_drive_pb.StatResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WriteFileRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteFileRequest)) {
    throw new Error('Expected argument of type WriteFileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteFileRequest(buffer_arg) {
  return daemon_drive_pb.WriteFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WriteFileResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteFileResponse)) {
    throw new Error('Expected argument of type WriteFileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteFileResponse(buffer_arg) {
  return daemon_drive_pb.WriteFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var DriveService = exports.DriveService = {
  get: {
    path: '/Drive/get',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.GetDriveRequest,
    responseType: daemon_drive_pb.GetDriveResponse,
    requestSerialize: serialize_GetDriveRequest,
    requestDeserialize: deserialize_GetDriveRequest,
    responseSerialize: serialize_GetDriveResponse,
    responseDeserialize: deserialize_GetDriveResponse,
  },
  writeFile: {
    path: '/Drive/writeFile',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.WriteFileRequest,
    responseType: daemon_drive_pb.WriteFileResponse,
    requestSerialize: serialize_WriteFileRequest,
    requestDeserialize: deserialize_WriteFileRequest,
    responseSerialize: serialize_WriteFileResponse,
    responseDeserialize: deserialize_WriteFileResponse,
  },
  readFile: {
    path: '/Drive/readFile',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.ReadFileRequest,
    responseType: daemon_drive_pb.ReadFileResponse,
    requestSerialize: serialize_ReadFileRequest,
    requestDeserialize: deserialize_ReadFileRequest,
    responseSerialize: serialize_ReadFileResponse,
    responseDeserialize: deserialize_ReadFileResponse,
  },
  list: {
    path: '/Drive/list',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.ListRequest,
    responseType: daemon_drive_pb.ListResponse,
    requestSerialize: serialize_ListRequest,
    requestDeserialize: deserialize_ListRequest,
    responseSerialize: serialize_ListResponse,
    responseDeserialize: deserialize_ListResponse,
  },
  stat: {
    path: '/Drive/stat',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.StatRequest,
    responseType: daemon_drive_pb.StatResponse,
    requestSerialize: serialize_StatRequest,
    requestDeserialize: deserialize_StatRequest,
    responseSerialize: serialize_StatResponse,
    responseDeserialize: deserialize_StatResponse,
  },
  // TODO: Extend with the rest of the Hyperdrive API
};

exports.DriveClient = grpc.makeGenericClientConstructor(DriveService);
