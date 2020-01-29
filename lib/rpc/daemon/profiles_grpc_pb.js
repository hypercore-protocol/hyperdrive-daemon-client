// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var daemon_profiles_pb = require('../daemon/profiles_pb.js');
var daemon_common_pb = require('../daemon/common_pb.js');

function serialize_CreateProfileRequest(arg) {
  if (!(arg instanceof daemon_profiles_pb.CreateProfileRequest)) {
    throw new Error('Expected argument of type CreateProfileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateProfileRequest(buffer_arg) {
  return daemon_profiles_pb.CreateProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateProfileResponse(arg) {
  if (!(arg instanceof daemon_profiles_pb.CreateProfileResponse)) {
    throw new Error('Expected argument of type CreateProfileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateProfileResponse(buffer_arg) {
  return daemon_profiles_pb.CreateProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CurrentProfileRequest(arg) {
  if (!(arg instanceof daemon_profiles_pb.CurrentProfileRequest)) {
    throw new Error('Expected argument of type CurrentProfileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CurrentProfileRequest(buffer_arg) {
  return daemon_profiles_pb.CurrentProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CurrentProfileResponse(arg) {
  if (!(arg instanceof daemon_profiles_pb.CurrentProfileResponse)) {
    throw new Error('Expected argument of type CurrentProfileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CurrentProfileResponse(buffer_arg) {
  return daemon_profiles_pb.CurrentProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteProfileRequest(arg) {
  if (!(arg instanceof daemon_profiles_pb.DeleteProfileRequest)) {
    throw new Error('Expected argument of type DeleteProfileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteProfileRequest(buffer_arg) {
  return daemon_profiles_pb.DeleteProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteProfileResponse(arg) {
  if (!(arg instanceof daemon_profiles_pb.DeleteProfileResponse)) {
    throw new Error('Expected argument of type DeleteProfileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteProfileResponse(buffer_arg) {
  return daemon_profiles_pb.DeleteProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SwitchProfileRequest(arg) {
  if (!(arg instanceof daemon_profiles_pb.SwitchProfileRequest)) {
    throw new Error('Expected argument of type SwitchProfileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SwitchProfileRequest(buffer_arg) {
  return daemon_profiles_pb.SwitchProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SwitchProfileResponse(arg) {
  if (!(arg instanceof daemon_profiles_pb.SwitchProfileResponse)) {
    throw new Error('Expected argument of type SwitchProfileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SwitchProfileResponse(buffer_arg) {
  return daemon_profiles_pb.SwitchProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ProfilesService = exports.ProfilesService = {
  create: {
    path: '/Profiles/create',
    requestStream: false,
    responseStream: false,
    requestType: daemon_profiles_pb.CreateProfileRequest,
    responseType: daemon_profiles_pb.CreateProfileResponse,
    requestSerialize: serialize_CreateProfileRequest,
    requestDeserialize: deserialize_CreateProfileRequest,
    responseSerialize: serialize_CreateProfileResponse,
    responseDeserialize: deserialize_CreateProfileResponse,
  },
  delete: {
    path: '/Profiles/delete',
    requestStream: false,
    responseStream: false,
    requestType: daemon_profiles_pb.DeleteProfileRequest,
    responseType: daemon_profiles_pb.DeleteProfileResponse,
    requestSerialize: serialize_DeleteProfileRequest,
    requestDeserialize: deserialize_DeleteProfileRequest,
    responseSerialize: serialize_DeleteProfileResponse,
    responseDeserialize: deserialize_DeleteProfileResponse,
  },
  switch: {
    path: '/Profiles/switch',
    requestStream: false,
    responseStream: false,
    requestType: daemon_profiles_pb.SwitchProfileRequest,
    responseType: daemon_profiles_pb.SwitchProfileResponse,
    requestSerialize: serialize_SwitchProfileRequest,
    requestDeserialize: deserialize_SwitchProfileRequest,
    responseSerialize: serialize_SwitchProfileResponse,
    responseDeserialize: deserialize_SwitchProfileResponse,
  },
  current: {
    path: '/Profiles/current',
    requestStream: false,
    responseStream: false,
    requestType: daemon_profiles_pb.CurrentProfileRequest,
    responseType: daemon_profiles_pb.CurrentProfileResponse,
    requestSerialize: serialize_CurrentProfileRequest,
    requestDeserialize: deserialize_CurrentProfileRequest,
    responseSerialize: serialize_CurrentProfileResponse,
    responseDeserialize: deserialize_CurrentProfileResponse,
  },
};

exports.ProfilesClient = grpc.makeGenericClientConstructor(ProfilesService);
