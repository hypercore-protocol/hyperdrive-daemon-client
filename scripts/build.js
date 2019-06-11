const p = require('path')
const { execSync } = require('child_process')
const { hyperdriveSchemaPath, daemonSchemaPaths } = require('hyperdrive-schemas')

// The complete path must be converted into a protoc search directory.
const hyperdriveSchemaDir = p.dirname(hyperdriveSchemaPath)

const cmd = `\
  grpc_tools_node_protoc\
    -I=${hyperdriveSchemaDir}\
    --js_out=import_style=commonjs,binary:./lib/rpc\
    --grpc_out=./lib/rpc\
    --plugin=protoc-gen-grpc=\`which grpc_tools_node_protoc_plugin\`\
    ${daemonSchemaPaths}/* ${hyperdriveSchemaPath}`

execSync(cmd)
