const express = require('express');
const router = express.Router();
const pool = require('../../../db')

router.get('/moduleName/:subject', async function(req, res, next) { 
  const subject = req.params.subject
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList` where module_eng = "'+ subject +'"')
  conn.release()
  console.log(rows[0].module_kr)
  console.log("===========show==========")
  res.status(200).send(rows[0].module_kr)
});

router.get('/multipleChoiceList/:subject', async function(req, res, next) { 
  const subject = req.params.subject
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select q_no, group_concat(m_no separator "<<><") as m_nos from fiveworks_aurora_db.`ksa_multipleChoice2` where subject="' + subject + '" and `answer` = "t" group by q_no')
  conn.release()

  res.status(200).send(rows)
});

router.get('/list/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  var sql = 'select ot.subject, ot.q_no, ot.question, ot.`comment`, group_concat(mul.m_no separator "<<><") as m_nos, group_concat(mul.choice separator "<<><") as choices from fiveworks_aurora_db.ksa_onlineTest2 as ot, fiveworks_aurora_db.ksa_multipleChoice2 as mul where ot.q_no = mul.q_no and'
  sql += ' ot.subject = "' + subject + '" group by ot.q_no'

  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query(sql)
  console.log(rows);
  conn.release()
  // console.log(rows)
  res.status(200).send(rows)
})


// 필기 평가 문제 입력 ajax처리
router.post('/:subject/testinput',async function(req, res, next){
  var subject=req.params.subject;
  var array = req.body.arr; 
  console.log(array);
  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('INSERT INTO fiveworks_aurora_db.ksa_onlineTest2 (`subject`, `question`, `comment`) VALUES (?, ?, ?);',
    [subject,array.question, array.question_comment])
  console.log(result.insertId);
  var q_no =result.insertId; 
  await conn.query('INSERT INTO fiveworks_aurora_db.ksa_multipleChoice2 (q_no,subject, choice, answer) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?);',
    [q_no,subject,array.question_ex1, array.question_ex1_answer,
      q_no,subject,array.question_ex2,array.question_ex2_answer,
      q_no,subject,array.question_ex3,array.question_ex3_answer,
      q_no,subject,array.question_ex4,array.question_ex4_answer,
      q_no,subject,array.question_ex5,array.question_ex5_answer])
  conn.release()
  res.status(200).send("success");
  });

router.put('/:subject/testinput',async function(req, res, next){
  var subject=req.params.subject;
  var array = req.body.arr; 
  // console.log(array);
  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('update fiveworks_aurora_db.ksa_onlineTest2 set `subject`=? ,`question`=?, `comment`=? where `q_no`=?',
    [subject,array.question, array.question_comment,array.q_no])
  // var q_no =result.insertId; 
  // await conn.query('update fiveworks_aurora_db.ksa_multipleChoice (q_no,subject, choice, answer) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?);',
  //   [q_no,subject,array.question_ex1, array.question_ex1_answer,q_no,subject,array.question_ex2,array.question_ex2_answer,q_no,subject,array.question_ex3,array.question_ex3_answer,q_no,subject,array.question_ex4,array.question_ex4_answer])
  await conn.query(`
  UPDATE fiveworks_aurora_db.ksa_multipleChoice2 
  SET
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      choice = CASE m_no WHEN ? THEN ? ELSE choice END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END,
      answer = CASE m_no WHEN ? THEN ? ELSE answer END
  WHERE
    m_no IN (?,?,?,?,?);
  `,[array.m_nos1,array.question_ex1,
     array.m_nos2,array.question_ex2,
     array.m_nos3,array.question_ex3,
     array.m_nos4,array.question_ex4,
     array.m_nos5,array.question_ex5,
     array.m_nos1,array.question_ex1_answer,
     array.m_nos2,array.question_ex2_answer,
     array.m_nos3,array.question_ex3_answer,
     array.m_nos4,array.question_ex4_answer,
     array.m_nos5,array.question_ex5_answer,
     array.m_nos1,array.m_nos2,array.m_nos3,array.m_nos4,array.m_nos5])
    conn.release()
  res.status(200).send("success");
})

module.exports = router;