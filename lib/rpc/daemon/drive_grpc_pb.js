// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_drive_pb = require('../daemon/drive_pb.js');
var daemon_common_pb = require('../daemon/common_pb.js');
var hyperdrive_pb = require('../hyperdrive_pb.js');

function serialize_ActiveRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ActiveRequest)) {
    throw new Error('Expected argument of type ActiveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ActiveRequest(buffer_arg) {
  return daemon_drive_pb.ActiveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ActiveResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ActiveResponse)) {
    throw new Error('Expected argument of type ActiveResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ActiveResponse(buffer_arg) {
  return daemon_drive_pb.ActiveResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_ConfigureNetworkRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ConfigureNetworkRequest)) {
    throw new Error('Expected argument of type ConfigureNetworkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureNetworkRequest(buffer_arg) {
  return daemon_drive_pb.ConfigureNetworkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureNetworkResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ConfigureNetworkResponse)) {
    throw new Error('Expected argument of type ConfigureNetworkResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureNetworkResponse(buffer_arg) {
  return daemon_drive_pb.ConfigureNetworkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteMetadataRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DeleteMetadataRequest)) {
    throw new Error('Expected argument of type DeleteMetadataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteMetadataRequest(buffer_arg) {
  return daemon_drive_pb.DeleteMetadataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteMetadataResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DeleteMetadataResponse)) {
    throw new Error('Expected argument of type DeleteMetadataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteMetadataResponse(buffer_arg) {
  return daemon_drive_pb.DeleteMetadataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiffStreamRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DiffStreamRequest)) {
    throw new Error('Expected argument of type DiffStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiffStreamRequest(buffer_arg) {
  return daemon_drive_pb.DiffStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiffStreamResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DiffStreamResponse)) {
    throw new Error('Expected argument of type DiffStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiffStreamResponse(buffer_arg) {
  return daemon_drive_pb.DiffStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DownloadRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DownloadRequest)) {
    throw new Error('Expected argument of type DownloadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DownloadRequest(buffer_arg) {
  return daemon_drive_pb.DownloadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DownloadResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DownloadResponse)) {
    throw new Error('Expected argument of type DownloadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DownloadResponse(buffer_arg) {
  return daemon_drive_pb.DownloadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveMountsRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveMountsRequest)) {
    throw new Error('Expected argument of type DriveMountsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveMountsRequest(buffer_arg) {
  return daemon_drive_pb.DriveMountsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveMountsResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveMountsResponse)) {
    throw new Error('Expected argument of type DriveMountsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveMountsResponse(buffer_arg) {
  return daemon_drive_pb.DriveMountsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveStatsRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveStatsRequest)) {
    throw new Error('Expected argument of type DriveStatsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveStatsRequest(buffer_arg) {
  return daemon_drive_pb.DriveStatsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveStatsResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveStatsResponse)) {
    throw new Error('Expected argument of type DriveStatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveStatsResponse(buffer_arg) {
  return daemon_drive_pb.DriveStatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveVersionRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveVersionRequest)) {
    throw new Error('Expected argument of type DriveVersionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveVersionRequest(buffer_arg) {
  return daemon_drive_pb.DriveVersionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DriveVersionResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.DriveVersionResponse)) {
    throw new Error('Expected argument of type DriveVersionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DriveVersionResponse(buffer_arg) {
  return daemon_drive_pb.DriveVersionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_FileStatsRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.FileStatsRequest)) {
    throw new Error('Expected argument of type FileStatsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_FileStatsRequest(buffer_arg) {
  return daemon_drive_pb.FileStatsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_FileStatsResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.FileStatsResponse)) {
    throw new Error('Expected argument of type FileStatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_FileStatsResponse(buffer_arg) {
  return daemon_drive_pb.FileStatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_MkdirRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.MkdirRequest)) {
    throw new Error('Expected argument of type MkdirRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MkdirRequest(buffer_arg) {
  return daemon_drive_pb.MkdirRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MkdirResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.MkdirResponse)) {
    throw new Error('Expected argument of type MkdirResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MkdirResponse(buffer_arg) {
  return daemon_drive_pb.MkdirResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MountDriveRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.MountDriveRequest)) {
    throw new Error('Expected argument of type MountDriveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MountDriveRequest(buffer_arg) {
  return daemon_drive_pb.MountDriveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MountDriveResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.MountDriveResponse)) {
    throw new Error('Expected argument of type MountDriveResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MountDriveResponse(buffer_arg) {
  return daemon_drive_pb.MountDriveResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_ReadStreamRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadStreamRequest)) {
    throw new Error('Expected argument of type ReadStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadStreamRequest(buffer_arg) {
  return daemon_drive_pb.ReadStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadStreamResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.ReadStreamResponse)) {
    throw new Error('Expected argument of type ReadStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadStreamResponse(buffer_arg) {
  return daemon_drive_pb.ReadStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RmdirRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.RmdirRequest)) {
    throw new Error('Expected argument of type RmdirRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RmdirRequest(buffer_arg) {
  return daemon_drive_pb.RmdirRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RmdirResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.RmdirResponse)) {
    throw new Error('Expected argument of type RmdirResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RmdirResponse(buffer_arg) {
  return daemon_drive_pb.RmdirResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_StatsRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.StatsRequest)) {
    throw new Error('Expected argument of type StatsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatsRequest(buffer_arg) {
  return daemon_drive_pb.StatsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StatsResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.StatsResponse)) {
    throw new Error('Expected argument of type StatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StatsResponse(buffer_arg) {
  return daemon_drive_pb.StatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SymlinkRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.SymlinkRequest)) {
    throw new Error('Expected argument of type SymlinkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SymlinkRequest(buffer_arg) {
  return daemon_drive_pb.SymlinkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SymlinkResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.SymlinkResponse)) {
    throw new Error('Expected argument of type SymlinkResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SymlinkResponse(buffer_arg) {
  return daemon_drive_pb.SymlinkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UndownloadRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.UndownloadRequest)) {
    throw new Error('Expected argument of type UndownloadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UndownloadRequest(buffer_arg) {
  return daemon_drive_pb.UndownloadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UndownloadResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.UndownloadResponse)) {
    throw new Error('Expected argument of type UndownloadResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UndownloadResponse(buffer_arg) {
  return daemon_drive_pb.UndownloadResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UnlinkRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.UnlinkRequest)) {
    throw new Error('Expected argument of type UnlinkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnlinkRequest(buffer_arg) {
  return daemon_drive_pb.UnlinkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UnlinkResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.UnlinkResponse)) {
    throw new Error('Expected argument of type UnlinkResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnlinkResponse(buffer_arg) {
  return daemon_drive_pb.UnlinkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UnmountDriveRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.UnmountDriveRequest)) {
    throw new Error('Expected argument of type UnmountDriveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnmountDriveRequest(buffer_arg) {
  return daemon_drive_pb.UnmountDriveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UnmountDriveResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.UnmountDriveResponse)) {
    throw new Error('Expected argument of type UnmountDriveResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UnmountDriveResponse(buffer_arg) {
  return daemon_drive_pb.UnmountDriveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UpdateMetadataRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.UpdateMetadataRequest)) {
    throw new Error('Expected argument of type UpdateMetadataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UpdateMetadataRequest(buffer_arg) {
  return daemon_drive_pb.UpdateMetadataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UpdateMetadataResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.UpdateMetadataResponse)) {
    throw new Error('Expected argument of type UpdateMetadataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UpdateMetadataResponse(buffer_arg) {
  return daemon_drive_pb.UpdateMetadataResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_WriteStreamRequest(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteStreamRequest)) {
    throw new Error('Expected argument of type WriteStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteStreamRequest(buffer_arg) {
  return daemon_drive_pb.WriteStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WriteStreamResponse(arg) {
  if (!(arg instanceof daemon_drive_pb.WriteStreamResponse)) {
    throw new Error('Expected argument of type WriteStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WriteStreamResponse(buffer_arg) {
  return daemon_drive_pb.WriteStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var DriveService = exports.DriveService = {
  // Management methods
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
  close: {
    path: '/Drive/close',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.CloseSessionRequest,
    responseType: daemon_drive_pb.CloseSessionResponse,
    requestSerialize: serialize_CloseSessionRequest,
    requestDeserialize: deserialize_CloseSessionRequest,
    responseSerialize: serialize_CloseSessionResponse,
    responseDeserialize: deserialize_CloseSessionResponse,
  },
  allStats: {
    path: '/Drive/allStats',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.StatsRequest,
    responseType: daemon_drive_pb.StatsResponse,
    requestSerialize: serialize_StatsRequest,
    requestDeserialize: deserialize_StatsRequest,
    responseSerialize: serialize_StatsResponse,
    responseDeserialize: deserialize_StatsResponse,
  },
  active: {
    path: '/Drive/active',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.ActiveRequest,
    responseType: daemon_drive_pb.ActiveResponse,
    requestSerialize: serialize_ActiveRequest,
    requestDeserialize: deserialize_ActiveRequest,
    responseSerialize: serialize_ActiveResponse,
    responseDeserialize: deserialize_ActiveResponse,
  },
  // Session-specific operations
  configureNetwork: {
    path: '/Drive/configureNetwork',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.ConfigureNetworkRequest,
    responseType: daemon_drive_pb.ConfigureNetworkResponse,
    requestSerialize: serialize_ConfigureNetworkRequest,
    requestDeserialize: deserialize_ConfigureNetworkRequest,
    responseSerialize: serialize_ConfigureNetworkResponse,
    responseDeserialize: deserialize_ConfigureNetworkResponse,
  },
  stats: {
    path: '/Drive/stats',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.DriveStatsRequest,
    responseType: daemon_drive_pb.DriveStatsResponse,
    requestSerialize: serialize_DriveStatsRequest,
    requestDeserialize: deserialize_DriveStatsRequest,
    responseSerialize: serialize_DriveStatsResponse,
    responseDeserialize: deserialize_DriveStatsResponse,
  },
  // Drive operations
  version: {
    path: '/Drive/version',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.DriveVersionRequest,
    responseType: daemon_drive_pb.DriveVersionResponse,
    requestSerialize: serialize_DriveVersionRequest,
    requestDeserialize: deserialize_DriveVersionRequest,
    responseSerialize: serialize_DriveVersionResponse,
    responseDeserialize: deserialize_DriveVersionResponse,
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
  download: {
    path: '/Drive/download',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.DownloadRequest,
    responseType: daemon_drive_pb.DownloadResponse,
    requestSerialize: serialize_DownloadRequest,
    requestDeserialize: deserialize_DownloadRequest,
    responseSerialize: serialize_DownloadResponse,
    responseDeserialize: deserialize_DownloadResponse,
  },
  undownload: {
    path: '/Drive/undownload',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.UndownloadRequest,
    responseType: daemon_drive_pb.UndownloadResponse,
    requestSerialize: serialize_UndownloadRequest,
    requestDeserialize: deserialize_UndownloadRequest,
    responseSerialize: serialize_UndownloadResponse,
    responseDeserialize: deserialize_UndownloadResponse,
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
  createWriteStream: {
    path: '/Drive/createWriteStream',
    requestStream: true,
    responseStream: false,
    requestType: daemon_drive_pb.WriteStreamRequest,
    responseType: daemon_drive_pb.WriteStreamResponse,
    requestSerialize: serialize_WriteStreamRequest,
    requestDeserialize: deserialize_WriteStreamRequest,
    responseSerialize: serialize_WriteStreamResponse,
    responseDeserialize: deserialize_WriteStreamResponse,
  },
  writeFile: {
    path: '/Drive/writeFile',
    requestStream: true,
    responseStream: false,
    requestType: daemon_drive_pb.WriteFileRequest,
    responseType: daemon_drive_pb.WriteFileResponse,
    requestSerialize: serialize_WriteFileRequest,
    requestDeserialize: deserialize_WriteFileRequest,
    responseSerialize: serialize_WriteFileResponse,
    responseDeserialize: deserialize_WriteFileResponse,
  },
  createReadStream: {
    path: '/Drive/createReadStream',
    requestStream: false,
    responseStream: true,
    requestType: daemon_drive_pb.ReadStreamRequest,
    responseType: daemon_drive_pb.ReadStreamResponse,
    requestSerialize: serialize_ReadStreamRequest,
    requestDeserialize: deserialize_ReadStreamRequest,
    responseSerialize: serialize_ReadStreamResponse,
    responseDeserialize: deserialize_ReadStreamResponse,
  },
  readFile: {
    path: '/Drive/readFile',
    requestStream: false,
    responseStream: true,
    requestType: daemon_drive_pb.ReadFileRequest,
    responseType: daemon_drive_pb.ReadFileResponse,
    requestSerialize: serialize_ReadFileRequest,
    requestDeserialize: deserialize_ReadFileRequest,
    responseSerialize: serialize_ReadFileResponse,
    responseDeserialize: deserialize_ReadFileResponse,
  },
  updateMetadata: {
    path: '/Drive/updateMetadata',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.UpdateMetadataRequest,
    responseType: daemon_drive_pb.UpdateMetadataResponse,
    requestSerialize: serialize_UpdateMetadataRequest,
    requestDeserialize: deserialize_UpdateMetadataRequest,
    responseSerialize: serialize_UpdateMetadataResponse,
    responseDeserialize: deserialize_UpdateMetadataResponse,
  },
  deleteMetadata: {
    path: '/Drive/deleteMetadata',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.DeleteMetadataRequest,
    responseType: daemon_drive_pb.DeleteMetadataResponse,
    requestSerialize: serialize_DeleteMetadataRequest,
    requestDeserialize: deserialize_DeleteMetadataRequest,
    responseSerialize: serialize_DeleteMetadataResponse,
    responseDeserialize: deserialize_DeleteMetadataResponse,
  },
  createDiffStream: {
    path: '/Drive/createDiffStream',
    requestStream: false,
    responseStream: true,
    requestType: daemon_drive_pb.DiffStreamRequest,
    responseType: daemon_drive_pb.DiffStreamResponse,
    requestSerialize: serialize_DiffStreamRequest,
    requestDeserialize: deserialize_DiffStreamRequest,
    responseSerialize: serialize_DiffStreamResponse,
    responseDeserialize: deserialize_DiffStreamResponse,
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
  mkdir: {
    path: '/Drive/mkdir',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.MkdirRequest,
    responseType: daemon_drive_pb.MkdirResponse,
    requestSerialize: serialize_MkdirRequest,
    requestDeserialize: deserialize_MkdirRequest,
    responseSerialize: serialize_MkdirResponse,
    responseDeserialize: deserialize_MkdirResponse,
  },
  rmdir: {
    path: '/Drive/rmdir',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.RmdirRequest,
    responseType: daemon_drive_pb.RmdirResponse,
    requestSerialize: serialize_RmdirRequest,
    requestDeserialize: deserialize_RmdirRequest,
    responseSerialize: serialize_RmdirResponse,
    responseDeserialize: deserialize_RmdirResponse,
  },
  unlink: {
    path: '/Drive/unlink',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.UnlinkRequest,
    responseType: daemon_drive_pb.UnlinkResponse,
    requestSerialize: serialize_UnlinkRequest,
    requestDeserialize: deserialize_UnlinkRequest,
    responseSerialize: serialize_UnlinkResponse,
    responseDeserialize: deserialize_UnlinkResponse,
  },
  mount: {
    path: '/Drive/mount',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.MountDriveRequest,
    responseType: daemon_drive_pb.MountDriveResponse,
    requestSerialize: serialize_MountDriveRequest,
    requestDeserialize: deserialize_MountDriveRequest,
    responseSerialize: serialize_MountDriveResponse,
    responseDeserialize: deserialize_MountDriveResponse,
  },
  unmount: {
    path: '/Drive/unmount',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.UnmountDriveRequest,
    responseType: daemon_drive_pb.UnmountDriveResponse,
    requestSerialize: serialize_UnmountDriveRequest,
    requestDeserialize: deserialize_UnmountDriveRequest,
    responseSerialize: serialize_UnmountDriveResponse,
    responseDeserialize: deserialize_UnmountDriveResponse,
  },
  mounts: {
    path: '/Drive/mounts',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.DriveMountsRequest,
    responseType: daemon_drive_pb.DriveMountsResponse,
    requestSerialize: serialize_DriveMountsRequest,
    requestDeserialize: deserialize_DriveMountsRequest,
    responseSerialize: serialize_DriveMountsResponse,
    responseDeserialize: deserialize_DriveMountsResponse,
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
    requestStream: true,
    responseStream: true,
    requestType: daemon_drive_pb.WatchRequest,
    responseType: daemon_drive_pb.WatchResponse,
    requestSerialize: serialize_WatchRequest,
    requestDeserialize: deserialize_WatchRequest,
    responseSerialize: serialize_WatchResponse,
    responseDeserialize: deserialize_WatchResponse,
  },
  symlink: {
    path: '/Drive/symlink',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.SymlinkRequest,
    responseType: daemon_drive_pb.SymlinkResponse,
    requestSerialize: serialize_SymlinkRequest,
    requestDeserialize: deserialize_SymlinkRequest,
    responseSerialize: serialize_SymlinkResponse,
    responseDeserialize: deserialize_SymlinkResponse,
  },
  fileStats: {
    path: '/Drive/fileStats',
    requestStream: false,
    responseStream: false,
    requestType: daemon_drive_pb.FileStatsRequest,
    responseType: daemon_drive_pb.FileStatsResponse,
    requestSerialize: serialize_FileStatsRequest,
    requestDeserialize: deserialize_FileStatsRequest,
    responseSerialize: serialize_FileStatsResponse,
    responseDeserialize: deserialize_FileStatsResponse,
  },
};

exports.DriveClient = grpc.makeGenericClientConstructor(DriveService);
