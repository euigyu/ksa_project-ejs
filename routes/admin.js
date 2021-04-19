const express = require('express');
const router = express.Router();
const mysql= require('mysql');
const axios = require('axios')
const { checkToken, token } = require('../auth')
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
router.get('/:subject/enterscore', checkToken(), async (req, res, next) => { 
  var subject = req.params.subject;
  const scores = await axios.get(`${config.dbIp}/board/scoreInfo/${subject}`)
  const moduleNames = await axios.get(`${config.dbIp}/module/list/${subject}`)
  // console.log(moduleNames.data[0].module_kr)
  // console.log(scores);
  // console.log("1")
  res.render('board/enterScore', { 
    modulenames: moduleNames.data,
    scores: scores.data,
    subject
  });
});

//실기평가 게시판
router.get('/board/:subject', checkToken(), async (req, res, next) => { 
  var subject= req.params.subject;
  const posts = await axios.get(`${config.dbIp}/board/list/${subject}`)
  const moduleNames = await axios.get(`${config.dbIp}/module/list/${subject}`)
  res.render('board/board', {
    posts: posts.data,
    subject: subject,
    moduleNames: moduleNames.data,
    isLogin: true
  });
})

//강의 모듈 리스트 
router.get('/moduleList', checkToken(), async (req, res, next) => { 
  let modules = await axios.get(`${config.dbIp}/module/board/list`)
  res.render('board/moduleList', {
    modules: modules.data,
    isLogin: true
  });
});

//필기평가 문제 수정 페이지
router.get('/onlineTest/:subject', checkToken(), async function(req, res, next) { 
  var subject=req.params.subject;

  const modules = await axios.get(`${config.dbIp}/module/list`)
  const moduleNames = await axios.get(`${config.dbIp}/module/list/${subject}`)
  const questions = await axios.get(`${config.dbIp}/onlineTest/list/${subject}`)

  const ques = questions.data.map(question => ({...question, m_nos: question.m_nos.split(','), choices: question.choices.split(',')}))
  res.render('onlineTest/testInput', {
    modules: modules.data,
    modulenames: moduleNames.data,
    questions: ques,
    subject,
  })
})

//필기평가 모듈 선택페이지
router.get('/onlineTest', checkToken(), async (req, res, next) => { 
  let modules = await axios.get(`${config.dbIp}/module/list`)
  res.render('onlineTest/moduleList', {
    modules: modules.data,
    isLogin: true
  });
})

module.exports = router
