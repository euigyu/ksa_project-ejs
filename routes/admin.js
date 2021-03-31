const express = require('express');
const router = express.Router();
const mysql= require('mysql');
const axios = require('axios')
const { checkToken } = require('../auth')
const config = require('../config')
const dbcon = require('../db/mysql'); // db 모듈 추가 /* GET home page. */ 
const promiseMysql = require('mysql2/promise')
const pool = promiseMysql.createPool({
  connectionLimit: 70,
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
});

//실기평가 점수 입력 페이지
router.get('/:subject/enterscore', async (req, res, next) => { 
  checkToken(req, res, next, async (isLogin) => {
    if (isLogin) {
      var subject = req.params.subject;
  
      const moduleNames = await axios.get(`${config.dbIp}/moduleList/${subject}`)
      res.render('board/enterScore', { 
        modulenames: moduleNames.data,
        subject
      });
    } else {
      res.render('login',{})
    }

  })
});

//실기평가 게시판
router.get('/board/:subject', async (req, res, next) => { 
  var subject= req.params.subject;

  checkToken(req, res, next, async (isLogin) => {
    if (isLogin) {
      const posts = await axios.get(`${config.dbIp}/boardList/${subject}`)
      const moduleNames = await axios.get(`${config.dbIp}/moduleList/${subject}`)
      res.render('board/board', {
        posts: posts.data,
        subject: subject,
        moduleNames: moduleNames.data,
        isLogin
      });
    } else {
      res.render('login', {})
    }
  })
})

//강의 모듈 리스트 
router.get('/moduleList', async (req, res, next) => { 
  checkToken(req, res, next, async (isLogin) => {
    let modules = await axios.get(`${config.dbIp}/moduleList`)
    if (isLogin) {
      res.render('board/moduleList', {
        modules: modules.data,
        isLogin
      });
    } else {
      res.render('login', {})
    }
  })
});

module.exports = router