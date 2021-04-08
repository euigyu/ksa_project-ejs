const express = require('express');
const router = express.Router();
const mysql= require('mysql');
const axios = require('axios');
const excel = require('exceljs');
const { checkToken } = require('../auth')
const queryString = require('query-string')
const config = require('../config')
const dbcon = require('../db/mysql'); // db 모듈 추가 /* GET home page. */ 
const db = mysql.createConnection({
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
});
const promiseMysql = require('mysql2/promise')
const pool = promiseMysql.createPool({
  connectionLimit: 70,
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
});


router.get('/login', function(req, res, next) { 
    res.render('login', { 
      rows: []
  }); 
}); 
router.get('/', function(req, res, next) { 
    res.render('home', { 
      rows: []
  }); 
});
router.get('/board/:subject/selectscore', function(req, res, next) { 
  var subject =req.params.subject;
  dbcon.moduleName(subject, function(modulenames){
    res.render('board/selectScore', { 
      modulenames: modulenames,
      subject
    }); 
  });
});
// 실기 평가 성적 조회 ajax통신 
router.post('/board/:subject/selectscore/result', function(req, res, next) { 
  var subject = req.params.subject;
  var body = req.body;
  console.log(body.std_name);
  db.query('SELECT * FROM fiveworks_aurora_db.`ksa_scoreInfo` where subject="'+subject+'"and name="'+body.std_name+'" and std_no="'+body.std_no+'"', (err, result) => {
    if(err){
     throw err;      
    }
    console.log(result); 
    res.send(result); 
    // callback(JSON.parse(JSON.stringify(links))); 
   });
}); 
//실기 평가 성정 입력 ajax통신
router.post("/:subject/enterscore", function (req, res) {
 subject = req.params.subject;
 var array = req.body.arr; 
  var str ="";
  console.log(array);
  console.log('what')
  // for(var i =0;i<array.length;i++){
  //   db.query('INSERT INTO fiveworks_aurora_db.`ksa_scoreInfo` (`subject`, `group`, `std_no`, `name`, `score`, `personal_cmt`, `team_cmt`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, std_no=?;'
  //   [subject, array[i].group, array[i].std_no, array[i].std_name, array[i].std_score, array[i].personal_comment,array[i].team_comment, array[i].std_name, array[i].std_score], function () {
  //     res.status(200).send("succes");
  //   });
  // };
});
// 실기 평가 성적 수정 ing...
router.post("/:subject/editscore/edit", function (req, res) {
  var array = req.body.arr; 
  var subject = req.params.subject;
  console.log(array);
  // for(var i =0;i<array.length;i++){
  //   db.query('UPDATE fiveworks_aurora_db.`ksa_scoreInfo` SET `score`=?, `personal_cmt`=?, `team_cmt`=? WHERE `subject`=? and `std_no`=?',
  //   [array[i].std_score, array[i].personal_comment,array[i].team_comment,subject, array[i].std_no], function () {
  //     res.status(200).send("succes");
  //   });
  // };
});
//필기평가 모듈 선택페이지
router.get('/onlineTest', function(req, res, next) { 
  dbcon.moduleList(function (modules) {
      res.render('onlineTest/moduleList', {
        modules: modules
      });
    }); 
})
//필기 평가 페이지
router.get('/onlineTest/:subject', async function(req, res, next) { 
  var subject=req.params.subject;
  
  const modules = await axios.get(`${config.dbIp}/moduleList`)
  const moduleNames = await axios.get(`${config.dbIp}/moduleList/${subject}`)
  const questions = await axios.get(`${config.dbIp}/onlineTestList/${subject}`)

  const ques = questions.data.map(question => ({...question, m_nos: question.m_nos.split(','), choices: question.choices.split(',')}))
  res.render('onlineTest/testpage', {
    modules: modules.data,
    modulenames: moduleNames.data,
    questions: ques,
    subject,
  });
})
//필기 평가 결과 처리 ajax
router.get('/onlineTest/:subject/result', async (req, res, next) => {
  var checked = req.query.checked;
  console.log(checked);
  var subject = req.params.subject;

  const modules = await axios.get(`${config.dbIp}/moduleList`)
  const moduleNames = await axios.get(`${config.dbIp}/moduleList/${subject}`)
  const questions = await axios.get(`${config.dbIp}/onlineTestList/${subject}`)

  const ques = questions.data.map(question => ({...question, m_nos: question.m_nos.split(','), choices: question.choices.split(',')}))

  res.render('onlineTest/resultpage', {
    modules: modules.data,
    modulenames: moduleNames.data,
    questions: ques,
    checked: checked,
    subject
  })
});
//필기평가 성적 다운로드
router.post('/onlineTest/result/down', async (req, res, next) => {
  // var subject = req.params.subject;
  // console.log(subject);
    let conn = await pool.getConnection(async _conn =>conn) 
    let [data]=await conn.query("SELECT * FROM fiveworks_aurora_db.ksa_scoreInfo_online order by subject asc")
      // const jsonCustomers = JSON.parse(JSON.stringify(data));
     console.log(JSON.parse(JSON.stringify(data)));
     conn.release();
     var result = JSON.parse(JSON.stringify(data));
     res.status(200).send(result);
    });

 //필기 평가 성적 결과 저장 ajax
router.post('/onlineTest/:subject/result/', async (req, res, next) => {
  var subject = req.params.subject;
  var array = (req.body);
  console.log(array.name);
  console.log(subject);
  let conn = await pool.getConnection(async _conn => _conn)
  await conn.query('INSERT INTO fiveworks_aurora_db.ksa_scoreInfo_online (`subject`, `name`, `std_no`,`score`) VALUES (?, ?, ?, ?);',
  [subject,array.name, array.std_no,array.score])
  conn.release()
  res.status(200).send("success");
  }); 

//필기 평가 성적 다운 로드
// router.post('/onlineTest/:subject/result/down', async (req, res, next) => {
//   var subject = req.params.subject;
//   console.log(subject);
//   let conn = await pool.getConnection(async _conn => _conn)
//   await conn.query('select * from fiveworks_aurora_db.ksa_scoreInfo_online where = "'+subject+'";',)
//   conn.release()
//   res.status(200).send("success");
//   }); 

//필기 평가 문제입력 페이지
router.get('/onlineTest/:subject/submit', function(req, res, next) { 
  var subject=req.params.subject;
  dbcon.moduleList(function (modules) {
      dbcon.moduleName(subject,function (modulenames) {
        dbcon.multipleChoiceList(subject,function (multiples){
        console.log(multiples);  
        res.render('onlineTest/testInput', {
            modules: modules,
            modulenames: modulenames,
            multiples: multiples,
            subject
          });
        });
      });
    }); 
})
//필기 평가 문제 입력 ajax처리
router.post('/onlineTest/:subject/testinput',async function(req, res, next){
  var subject=req.params.subject;
  subject = req.params.subject;
  var array = req.body.arr; 
  console.log(array);
  let conn = await pool.getConnection(async _conn => _conn)
  for(var i=0; i<array.length;i++){
    let [result] = await conn.query('INSERT INTO fiveworks_aurora_db.ksa_onlineTest (`subject`, `question`, `comment`) VALUES (?, ?, ?);',
      [subject,array[i].question, array[i].question_comment])
    console.log(result.insertId);
    var q_no =result.insertId; 
    await conn.query('INSERT INTO fiveworks_aurora_db.ksa_multipleChoice (q_no,subject, choice, answer) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?);',
      [q_no,subject,array[i].question_ex1, array[i].question_ex1_answer,q_no,subject,array[i].question_ex2,array[i].question_ex2_answer,q_no,subject,array[i].question_ex3,array[i].question_ex3_answer,q_no,subject,array[i].question_ex4,array[i].question_ex4_answer])
  }
    conn.release()
    res.status(200).send("success");
  });

//실기평가 게시판
router.get('/board/:subject', function(req, res, next) { 
  var subject= req.params.subject;
  dbcon.boardList(subject, function (posts) {
    dbcon.moduleName(subject, function(moduleNames) {
    console.log(moduleNames);
      res.render('board/board', {
        posts: posts,
        subject: subject,
        moduleNames: moduleNames
      });
    }); 
  });
})
//실기평가 성적 수정 페이지
router.get('/board/:subject/editScore', function(req, res, next) { 
  var subject= req.params.subject;
  dbcon.scoreInfo(subject, function (scores) {
    dbcon.moduleName(subject, function(modulenames){
    res.render('board/editScore', {
        scores: scores,
        modulenames:modulenames,
        subject
      });
    }); 
  });
});
//강의 모듈 리스트 
router.get('/moduleList', function(req, res, next) { 
    dbcon.moduleList(function (modules) {
        res.render('board/moduleList', {
          modules: modules
        });
      }); 
});
//실기 평가 게시글 업로드
router.get('/board/:subject/new', function(req, res, next) { 
  // db.lectureList((rows) =>{ 
    // console.log(rows);
    var sub = req.params.subject;
    dbcon.moduleName(sub, function(modulenames){
      console.log(modulenames)
    res.render('board/new', { 
      modulenames: modulenames 
    });
  });
});
// 게시글 수정 페이지
router.get('/board/:subject/:id/edit', function(req, res, next) { 
    var id=req.params.id;
    var subject=req.params.subject;
    dbcon.contents(id, function (content) {
      console.log(content[0]);
      res.render('board/edit', {
        content: content,
        subject
      });
    }); 
});

 //게시글 등록
router.post("/insert/:subject", function (req, res) {
  console.log("삽입 포스트 데이터 진행")
  var body = req.body;
  var subject = req.params.subject;
  db.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content], function () {
  res.redirect('/board/'+subject+'');
  })
})
//게시글 수정
router.post('/edit/:subject/:id', function(req, res, next) { 
  var id=req.params.id;
  var subject = req.params.subject;
  var body = req.body;
  db.query('update fiveworks_aurora_db.`ksa_board` set name = ? , std_no = ?, title = ?, content = ?, update_at = CURRENT_TIMESTAMP where board_id = ?', [body.name, body.std_no, body.title, body.content, id], function () {
  res.redirect('/board/'+subject+'');
  });
});
// 게시글 삭제
router.post('/board/:subject/:id/delete', function(req, res, next) { 
  const id=req.params.id;
  var subject=req.params.subject;
  db.query('update fiveworks_aurora_db.`ksa_board` set `delete` = "T" , delete_at = CURRENT_TIMESTAMP where board_id = ?', [id], function () {
    res.redirect('/board/'+subject+'');
    })
  });;
//게시글 확인
router.get('/board/:subject/:id', async (req, res, next) => {
  const id=req.params.id;
  const subject=req.params.subject;
   
  const rows = await axios.get(`${config.dbIp}/board/${id}`)
  const files = await axios.get(`${config.dbIp}/board/${id}/files`)

  var content = {}
  if (rows.data.length) {
    content = rows.data[0]
    console.log(content);
  }
  res.render('board/content', {
    content: rows.data,
    files: files.data,
    subject: subject || ''
  })
});

router.get('/lecture/:lecture/:id', function(req, res, next) { 
  const lecture = req.params.lecture
  const id = req.params.id
  
  dbcon.lectureList(lecture, function (rows) {
      dbcon.lectureLink(lecture, id, function (links) {
        res.render('lecture/lecture', {
            rows: rows,
            links: links
          });
        });
    });
  });
  
  
module.exports = router;


  