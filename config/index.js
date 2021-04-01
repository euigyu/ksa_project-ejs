const path = require('path')
const env = require('express')().get('env') || 'development'

const development = env
const config = { 
  root: path.join(__dirname, '..'),
  dbIp: development ? 'http://localhost:3008/api' : 'http://3.35.50.200:3008/api',
  fileApi: development ? 'http://localhost:3008/api/file' : 'http://3.35.50.200:3008/api/file'
}

module.exports = config
