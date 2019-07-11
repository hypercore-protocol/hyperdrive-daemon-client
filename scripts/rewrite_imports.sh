#!/bin/bash
# Wish this were not necessary.
find lib/rpc -regex ".*grpc.*.js" -exec sed -i "s/require('grpc')/require('@grpc\/grpc\-js')/g" {} \;
