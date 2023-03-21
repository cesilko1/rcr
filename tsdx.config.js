const tsconfig = require('./tsconfig.json')
const tsconfigPaths = require('tsconfig-paths')

tsconfigPaths.register({
  baseUrl: tsconfig.compilerOptions.baseUrl,
  paths: tsconfig.compilerOptions.paths
})
