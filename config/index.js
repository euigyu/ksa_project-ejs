const path = require('path')
const env = require('express')().get('env') || 'development'

const development = env
const config = { 
  root: path.join(__dirname, '..'),
<<<<<<< HEAD
  dbIp: 'http://localhost:3008/api',
  fileApi: 'http://localhost:3008/api/file'
}
=======
  dbIp: development ? 'http://localhost:3008/api' : 'http://3.35.50.200:3008/api',
  fileApi: development ? 'http://localhost:3008/api/file' : 'http://3.35.50.200:3008/api/file'
}

module.exports = config
>>>>>>> 256d6bb5aefbbbd1d471a390f5b3abcb3ca1dbd5
