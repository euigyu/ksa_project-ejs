
const express = require('express');
const router = express.Router();
const pool = require('../../../db')

router.get('/list/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList` where module_eng = "'+ subject +'"')
  conn.release()
  res.status(200).send(rows)
})

router.get('/list', async (req, res, next) => {
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList`')
  conn.release()
  res.status(200).send(rows)
})

module.exports = router;