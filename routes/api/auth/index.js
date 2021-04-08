const express = require('express');
const router = express.Router();
const Promise = require('bluebird')
const pool = require('../../../db')
const jwt = require('jsonwebtoken')
const { genSalt, hash, compareSync ,compare } = require('bcrypt');
const { password } = require('../../../auth');

router.post('/', async (req, res, next) => {
  const body = req.body
  const user = body.user
  if (!user.id || !user.pwd) {
    return res.json({
    success: 0
  })  
  }
  const salt = await genSalt(10)
  const id = user.id
  // const pwd = await hash(user.pwd.trim() , salt)
  const pwd = await hash(user.pwd , 9)

  let conn = await pool.getConnection(async _conn => _conn)
  const [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_user` (`id`, `pwd`) values ("' + id + '", "' + pwd + '")')

  conn.release()

  return res.json({
    success: 1
  }) 
})

router.post('/login', password() , async (req, res, next) => {
  let conn = await pool.getConnection(async _conn => _conn)
  const user = req.user
  const jwtSign = Promise.promisify(jwt.sign)
  jwtSign({id: user.id}, 'secret',{ expiresIn: '1400m' })
  .then((token) => ({token, user}))
  .then(async ({token, user}) => {
    const safetyLogin = `${user.id}.${Date.now()}.${Math.round(Math.random()*(99999 - 10000) + 10000)}`
    const [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_user_refresh_tokens` where `id` = "'+ user.id +'" ')
    let refreshTokens = (rows || [])
      .filter(t => {
        try { 
          jwt.verify(t, 'secret')
        } catch (e) { return false }
      }) 
    refreshTokens = [...refreshTokens, jwt.sign({id: safetyLogin}, 'secret', { expiresIn: 60 * 24 * 14 })]
    await conn.query('delete from fiveworks_aurora_db.`ksa_user_refresh_tokens` where `id` = "'+ user.id +'" ')

    let sql = 'insert into fiveworks_aurora_db.`ksa_user_refresh_tokens` (id, refreshToken) values'
    refreshTokens.forEach((_refreshToken, idx) => {
      sql += '("' + user.id
      sql += '", "' + _refreshToken
      sql += '")'
      if(refreshTokens.length - 1 != idx) {
        sql += ','
      }
    })
    await conn.query(sql)
    console.log(sql);
    return res.status(201).json({ token, user: { id: user.id }, safetyLogin})
  })
})

module.exports = router;