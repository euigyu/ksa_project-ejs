const path = require('path')
const env = require('express')().get('env') || 'development'

const development = env
const config = { 
  root: path.join(__dirname, '..'),
  dbIp: development ? 'http://localhost:3008/api' : 'http://localhost:3008/api',
  fileApi: development ? 'http://localhost:3008/api/file' : 'http://localhost:3008/api/file'
}

module.exports = config
