const express = require('express');
const router = express.Router();
const config = require('../config')
const uploader = require('../config/uploader')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { sign } = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const { genSaltSync, hashSync, compareSync ,compare } = require('bcrypt')
const pool = require('../db')

router.post('/register', async (req, res, next) => {
  const body = req.body
  const user = body.user
  if (!user.id || !user.pwd) {
    return res.json({
    success: 0
  })  
  }
  const salt = genSaltSync(10)
  const id = user.id
  const pwd = hashSync(user.pwd.trim() , salt)

  let conn = await pool.getConnection(async _conn => _conn)
  const [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_user` (`id`, `pwd`) values ("' + id + '", "' + pwd + '")')

  conn.release()

  return res.json({
    success: 1
  }) 
})

router.post('/login', async (req, res, next) => {
  const body = req.body
  const user = body.user
  let conn = await pool.getConnection(async _conn => _conn)
  
  // getUser
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_user` where `id` = "'+ user.id +'" ')
  if (rows.length) {
    // const result = await compare(user.pwd, rows[0].pwd)
    const result = user.pwd == rows[0].pwd
    if (result) {
      const token = sign({result: user.id }, 'secret', {  })

      res.cookie('token', token, { httpOnly: true })
      return res.json({
        success: 1,
        token
      })
    }
  }
  return res.json({
    success: 0
  })
})

router.get('/board', async function(req, res, next) { 
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where `delete` != "T" order by board_id desc')
  conn.release()

  res.status(200).send(rows)
});

router.get('/board/:id/files', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_attachment` where board_id ="'+id+'"')
  conn.release()
  
  res.status(200).send(rows)
});

router.get('/scoreInfo/:id', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_scoreInfo` where subject ="'+id+'"')
  console.log(rows)
  conn.release()
  res.status(200).send(rows)
})
router.get('/board/:id', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where board_id ="'+id+'"')
  conn.release()

  res.status(200).send(rows)
});

router.get('/multipleChoiceList/:subject', async function(req, res, next) { 
  const subject = req.params.subject
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select q_no, group_concat(m_no) as m_nos from fiveworks_aurora_db.`ksa_multipleChoice` where subject="' + subject + '" and `answer` = "t" group by q_no')
  conn.release()

  res.status(200).send(rows)
});

router.get('/onlineTestList/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  var sql = 'select ot.subject, ot.q_no, ot.question, ot.`comment`, group_concat(mul.m_no) as m_nos, group_concat(mul.choice) as choices from fiveworks_aurora_db.ksa_onlineTest as ot, fiveworks_aurora_db.ksa_multipleChoice as mul where ot.q_no = mul.q_no and'
  sql += ' ot.subject = "' + subject + '" group by ot.q_no'

  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query(sql)
  conn.release()
  // console.log(rows)
  res.status(200).send(rows)
})

router.get('/boardList/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where subject = "'+ subject +'" and `delete` != "T" order by board_id desc')
  conn.release()
  res.status(200).send(rows)
})

router.get('/moduleList/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList` where module_eng = "'+ subject +'"')
  conn.release()
  res.status(200).send(rows)
})

router.get('/moduleList', async (req, res, next) => {
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList`')
  conn.release()
  res.status(200).send(rows)
})

router.post('/file/insert', uploader('ksa').any(), async function(req, res, next) { 
  var files = req.files;
  res.status(200).send({files: files.map(_file => ({originalname: _file.originalname, filename: _file.filename}))});
});

router.get('/file/:filename', uploader('ksa').any(), async function(req, res, next) { 
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

router.post('/insert/:subject', async function(req, res, next) { 
  const body = req.body;
  const subject = req.params.subject
  const student = body.student

  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)',
    [student.name, student.std_no, subject, student.title, student.content])

  if(student.files.length) {
    let sql = 'insert into fiveworks_aurora_db.`ksa_attachment`(board_id, filename, originalname, endpoint) values '
    student.files.forEach((file, idx) => {
      sql += `(${result.insertId}, '${file.filename}', '${file.originalname}', '${config.fileApi}')`
      if(student.files.length - 1 != idx) {
        sql += ','
      }
    })
    await conn.query(sql)
  }

  conn.release()

  res.status(200).send();
});

router.post('/enterscore/:subject', async function(req, res, next) { 
  const array = req.body.arr;
  const subject = req.params.subject
  console.log(subject)
  // const student = body.student
  console.log(array)
  console.log("11111111111")
  let conn = await pool.getConnection(async _conn => _conn)
  for(var i = 0; i<array.length;i++){
    console.log("input")
    await conn.query('INSERT INTO fiveworks_aurora_db.`ksa_scoreInfo` (`subject`, `group`, `std_no`, `name`, `score`, `personal_cmt`, `team_cmt`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `group`=?, `score`=?, `personal_cmt`=?, `team_cmt`=?',
    [subject, array[i].group, array[i].std_no, array[i].std_name, array[i].std_score, array[i].personal_comment,array[i].team_comment,array[i].group, array[i].std_score,array[i].personal_comment,array[i].team_comment])
  }
  conn.release()
  res.status(200).send("success");
});

// 필기 평가 문제 입력 ajax처리
router.post('/onlineTest/:subject/testinput',async function(req, res, next){
  var subject=req.params.subject;
  var array = req.body.arr; 
  console.log(array);
  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('INSERT INTO fiveworks_aurora_db.ksa_onlineTest (`subject`, `question`, `comment`) VALUES (?, ?, ?);',
    [subject,array.question, array.question_comment])
  console.log(result.insertId);
  var q_no =result.insertId; 
  await conn.query('INSERT INTO fiveworks_aurora_db.ksa_multipleChoice (q_no,subject, choice, answer) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?);',
    [q_no,subject,array.question_ex1, array.question_ex1_answer,
      q_no,subject,array.question_ex2,array.question_ex2_answer,
      q_no,subject,array.question_ex3,array.question_ex3_answer,
      q_no,subject,array.question_ex4,array.question_ex4_answer])
  conn.release()
  res.status(200).send("success");
  });

router.put('/onlineTest/:subject/testinput',async function(req, res, next){
  var subject=req.params.subject;
  var array = req.body.arr; 
  // console.log(array);
  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('update fiveworks_aurora_db.ksa_onlineTest set `subject`=? ,`question`=?, `comment`=? where `q_no`=?',
    [subject,array.question, array.question_comment,array.q_no])
  // var q_no =result.insertId; 
  // await conn.query('update fiveworks_aurora_db.ksa_multipleChoice (q_no,subject, choice, answer) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?);',
  //   [q_no,subject,array.question_ex1, array.question_ex1_answer,q_no,subject,array.question_ex2,array.question_ex2_answer,q_no,subject,array.question_ex3,array.question_ex3_answer,q_no,subject,array.question_ex4,array.question_ex4_answer])
  await conn.query(`
  UPDATE fiveworks_aurora_db.ksa_multipleChoice 
  SET
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END
  WHERE
    m_no IN (?,?,?,?);
  `,[array.m_nos1,array.question_ex1,
     array.m_nos2,array.question_ex2,
     array.m_nos3,array.question_ex3,
     array.m_nos4,array.question_ex4,
     array.m_nos1,array.question_ex1_answer,
     array.m_nos2,array.question_ex2_answer,
     array.m_nos3,array.question_ex3_answer,
     array.m_nos4,array.question_ex4_answer,
     array.m_nos1,array.m_nos2,array.m_nos3,array.m_nos4])
    conn.release()
  res.status(200).send("success");
})

//필기평가 성적 다운로드
router.post('/board/result/down', async (req, res, next) => {
  // var subject = req.params.subject;
  // console.log(subject);
    console.log("start")
    let conn = await pool.getConnection(async _conn =>conn) 
    let [data]=await conn.query("SELECT * FROM fiveworks_aurora_db.ksa_scoreInfo order by subject asc, name asc")
      // const jsonCustomers = JSON.parse(JSON.stringify(data));
     console.log(JSON.parse(JSON.stringify(data)));
     conn.release();
     var result = JSON.parse(JSON.stringify(data));
     res.status(200).send(result);
 });

module.exports = router;


  