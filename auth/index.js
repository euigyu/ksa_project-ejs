const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { BasicStrategy } = require('passport-http')
const pool = require('../db')

passport.use('password', new BasicStrategy(async (userId, password, done) => {
  const conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_user` where `id` = "'+ userId +'" ')
  if(!rows.length) {
    done(true)
    return null
  }
  // const valid = await bcrypt.compare(password, rows[0].pwd)
  const valid = password == rows[0].pwd
  done(null, valid ? rows[0] : false)
  // done(null, rows[0])
}))

passport.use('token', new JwtStrategy({
  secretOrKey: 'secret',
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, async ({ id }, done) => {
  console.log(id);
  const conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_user` where `id` = "'+ id +'" ')
  if(!rows.length) {
    return null
  }
  done(null, rows[0])
  return null
}))

module.exports = {
  checkToken: (req, res, next, callback) => {
    let token = req.cookies.token
    console.log(token);
    if (token) {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          console.log(err);
          return callback(false)
        } else {
          req.decoded = decoded;
          return callback(true)
        }
      });
    } else {
      return callback(false)
    }
  }, 
  token: ({ required } = {}) => (req, res, next) => 
    passport.authenticate('token', { session: false }, (err, user, info) => {
      console.log(req);
      console.log(user);
      if (err || required && !user) {
        return res.status(401).end()
      }
      req.logIn(user, { session: false }, (err) => {
        if(err) {
          return res.status(401).end()
        }
        next()
      })
    })(req, res, next)
  ,
  password: () => (req, res, next) => 
    passport.authenticate('password', { session: false}, (err, user, info) => {
      if(err && err.param) {
        return res.status(400).json(err)
      } else if (err || !user) {
        return res.status(401).end()
      }
      req.logIn(user, { session: false }, (err) => {
        if(err) {
          return res.status(401).end()
        }
        next()
      })
    })(req, res, next)
};