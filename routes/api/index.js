const express = require('express');
const router = express.Router();

const file = require('./file')
const auth = require('./auth')
const board = require('./board')
const onlineTest = require('./onlineTest')
const modules = require('./module')

router.use('/file', file)
router.use('/auth', auth)
router.use('/board', board)
router.use('/onlineTest', onlineTest)
router.use('/module', modules)

module.exports = router;


  