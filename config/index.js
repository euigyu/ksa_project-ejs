const path = require('path')
const env = require('express')().get('env') || 'development'

const development = env
const config = { 
  root: path.join(__dirname, '..'),
  dbIp: development ? 'http://learnonline.click/api' : 'http://learnonline.click/api',
  fileApi: development ? 'htt/learnonline.click/api/file' : 'http://learnonline.click/api/file'
}

module.exports = config
