// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var daemon_drive_pb = require('../daemon/drive_pb.js');
var daemon_common_pb = require('../daemon/common_pb.js');
var hyperdrive_pb = require('../hyperdrive_pb.js');

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

function serialize_ListenRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ListenRequest)) {
    throw new Error('Expected argument of type ListenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ListenRequest(buffer_arg) {
  return daemon_drive_pb.ListenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ListenResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ListenResponse)) {
    throw new Error('Expected argument of type ListenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ListenResponse(buffer_arg) {
  return daemon_drive_pb.ListenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_OpenRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.OpenRequest)) {
    throw new Error('Expected argument of type OpenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_OpenRequest(buffer_arg) {
  return daemon_drive_pb.OpenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_OpenResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.OpenResponse)) {
    throw new Error('Expected argument of type OpenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_OpenResponse(buffer_arg) {
  return daemon_drive_pb.OpenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadDirectoryRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadDirectoryRequest)) {
    throw new Error('Expected argument of type ReadDirectoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadDirectoryRequest(buffer_arg) {
  return daemon_drive_pb.ReadDirectoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadDirectoryResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadDirectoryResponse)) {
    throw new Error('Expected argument of type ReadDirectoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadDirectoryResponse(buffer_arg) {
  return daemon_drive_pb.ReadDirectoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_ReadRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadRequest)) {
    throw new Error('Expected argument of type ReadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadRequest(buffer_arg) {
  return daemon_drive_pb.ReadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadResponse)) {
    throw new Error('Expected argument of type ReadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadResponse(buffer_arg) {
  return daemon_drive_pb.ReadResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_UnwatchRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.UnwatchRequest)) {
    throw new Error('Expected argument of type UnwatchRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnwatchRequest(buffer_arg) {
  return daemon_drive_pb.UnwatchRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UnwatchResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.UnwatchResponse)) {
    throw new Error('Expected argument of type UnwatchResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnwatchResponse(buffer_arg) {
  return daemon_drive_pb.UnwatchResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.WatchRequest)) {
    throw new Error('Expected argument of type WatchRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchRequest(buffer_arg) {
  return daemon_drive_pb.WatchRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WatchResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.WatchResponse)) {
    throw new Error('Expected argument of type WatchResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WatchResponse(buffer_arg) {
  return daemon_drive_pb.WatchResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_WriteRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteRequest)) {
    throw new Error('Expected argument of type WriteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteRequest(buffer_arg) {
  return daemon_drive_pb.WriteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WriteResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteResponse)) {
    throw new Error('Expected argument of type WriteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteResponse(buffer_arg) {
  return daemon_drive_pb.WriteResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  open: {
    path: '/Drive/open',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.OpenRequest,
    responseType: daemon_drive_pb.OpenResponse,
    requestSerialize: serialize_OpenRequest,
    requestDeserialize: deserialize_OpenRequest,
    responseSerialize: serialize_OpenResponse,
    responseDeserialize: deserialize_OpenResponse,
  },
  read: {
    path: '/Drive/read',
    requestStream: true,
    responseStream: true,
    requestType: daemon_drive_pb.ReadRequest,
    responseType: daemon_drive_pb.ReadResponse,
    requestSerialize: serialize_ReadRequest,
    requestDeserialize: deserialize_ReadRequest,
    responseSerialize: serialize_ReadResponse,
    responseDeserialize: deserialize_ReadResponse,
  },
  write: {
    path: '/Drive/write',
    requestStream: true,
    responseStream: true,
    requestType: daemon_drive_pb.WriteRequest,
    responseType: daemon_drive_pb.WriteResponse,
    requestSerialize: serialize_WriteRequest,
    requestDeserialize: deserialize_WriteRequest,
    responseSerialize: serialize_WriteResponse,
    responseDeserialize: deserialize_WriteResponse,
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
  readdir: {
    path: '/Drive/readdir',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.ReadDirectoryRequest,
    responseType: daemon_drive_pb.ReadDirectoryResponse,
    requestSerialize: serialize_ReadDirectoryRequest,
    requestDeserialize: deserialize_ReadDirectoryRequest,
    responseSerialize: serialize_ReadDirectoryResponse,
    responseDeserialize: deserialize_ReadDirectoryResponse,
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
  watch: {
    path: '/Drive/watch',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.WatchRequest,
    responseType: daemon_drive_pb.WatchResponse,
    requestSerialize: serialize_WatchRequest,
    requestDeserialize: deserialize_WatchRequest,
    responseSerialize: serialize_WatchResponse,
    responseDeserialize: deserialize_WatchResponse,
  },
  listen: {
    path: '/Drive/listen',
    requestStream: false,
    responseStream: true,
    requestType: daemon_drive_pb.ListenRequest,
    responseType: daemon_drive_pb.ListenResponse,
    requestSerialize: serialize_ListenRequest,
    requestDeserialize: deserialize_ListenRequest,
    responseSerialize: serialize_ListenResponse,
    responseDeserialize: deserialize_ListenResponse,
  },
  unwatch: {
    path: '/Drive/unwatch',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.UnwatchRequest,
    responseType: daemon_drive_pb.UnwatchResponse,
    requestSerialize: serialize_UnwatchRequest,
    requestDeserialize: deserialize_UnwatchRequest,
    responseSerialize: serialize_UnwatchResponse,
    responseDeserialize: deserialize_UnwatchResponse,
  },
  closeSession: {
    path: '/Drive/closeSession',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.CloseSessionRequest,
    responseType: daemon_drive_pb.CloseSessionResponse,
    requestSerialize: serialize_CloseSessionRequest,
    requestDeserialize: deserialize_CloseSessionRequest,
    responseSerialize: serialize_CloseSessionResponse,
    responseDeserialize: deserialize_CloseSessionResponse,
  },
  // TODO: Extend with the rest of the Hyperdrive API
};

exports.DriveClient = grpc.makeGenericClientConstructor(DriveService);
