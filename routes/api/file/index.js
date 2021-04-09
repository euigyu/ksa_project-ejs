const express = require('express');
const router = express.Router();
const uploader = require('../../../config/uploader')
const path = require('path')
const fs = require('fs')
const config = require('../../../config')
const sharp = require('sharp')

router.post('/', uploader('ksa').any(), async function(req, res, next) { 
  var files = req.files;
  res.status(200).send({files: files.map(_file => ({originalname: _file.originalname, filename: _file.filename}))});
});

router.get('/:filename', uploader('ksa').any(), async function(req, res, next) { 
  const filename = req.params.filename;
  const key = 'ksa'
  const root = config.root
  // const r = '32'

  const _path = path.resolve(root, 'public', 'files', key, filename)
  if (!fs.existsSync(_path)) { return res.status(404).end() }
  // if (r) {
  //   const output = fs.readFileSync(_path)
  //   return sharp(_path).resize(...r.split(',').map(v => v * 1)).toBuffer().then(output => res.send(output))
  // }
  return res.sendFile(_path)
});

module.exports = router;