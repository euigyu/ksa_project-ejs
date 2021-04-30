const express = require('express');
const router = express.Router();
const pool = require('../../../db')
const config = require('../../../config');
const { check } = require('../../../auth');

router.get('/', async function(req, res, next) { 
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where `delete` != "T" order by board_id desc')
  conn.release()

  res.status(200).send(rows)
});

router.get('/moduleName/:subject', async function(req, res, next) { 
  const subject = req.params.subject
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList` where module_eng = "'+ subject +'"')
  conn.release()

  res.status(200).send(rows)
});

router.get('/:id/files', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_attachment` where board_id ="'+id+'"')
  conn.release()
  
  res.status(200).send(rows)
});

router.get('/list/:subject', async (req, res, next) => {
  var subject = req.params.subject;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where subject = "'+ subject +'" and `delete` != "T" order by board_id desc')
  conn.release()
  res.status(200).send(rows)
})

router.get('/:id', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where board_id ="'+id+'"')
  conn.release()

  res.status(200).send(rows)
});

router.post('/:subject', check(), async function(req, res, next) { 
  const body = req.body;
  const subject = req.params.subject
  const student = body.student
  const id = req.id
  var show = id ? 'A' : 'S'

  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name, std_no, subject, title, content, `show`, create_at) values (?,?,?,?,?,?,CURRENT_TIMESTAMP)',
    [student.name, student.std_no || '', subject, student.title, student.content, show])

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

router.put('/', async function(req, res, next) { 
  const body = req.body;
  const student = body.student
  const id = body.id
  let conn = await pool.getConnection(async _conn => _conn)
  console.log(12);
  await conn.query('update fiveworks_aurora_db.`ksa_board` set name = "' + 
    student.name +'", std_no = "' + 
    student.std_no+ '", title = "' + 
    student.title +'", content = "' + 
    student.content + '", update_at = CURRENT_TIMESTAMP where board_id = ' + 
    id )

  await conn.query('delete from fiveworks_aurora_db.`ksa_attachment` where board_id = ?', [id])

  if(student.files.length) {
    let sql = 'insert into fiveworks_aurora_db.`ksa_attachment`(board_id, filename, originalname, endpoint) values '
    student.files.forEach((file, idx) => {
      sql += `(${id}, '${file.filename}', '${file.originalname}', '${config.fileApi}')`
      if(student.files.length - 1 != idx) {
        sql += ','
      }
    })
    await conn.query(sql)
  }

  conn.release()

  res.status(200).send();
});

router.get('/scoreInfo/:id', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_scoreInfo` where subject ="'+id+'"')
  conn.release()
  res.status(200).send(rows)
})

router.post('/enterscore/:subject', async function(req, res, next) { 
  const array = req.body.arr;
  const subject = req.params.subject
  console.log(subject)
  // const student = body.student
  console.log(array)
  console.log("11111111111")
  let conn = await pool.getConnection(async _conn => _conn)
  //for(var i = 0; i<array.length;i++){
    console.log(array.subject)
    await conn.query('INSERT INTO fiveworks_aurora_db.`ksa_scoreInfo` (`subject`, `group`, `std_no`, `name`, `score`, `personal_cmt`, `team_cmt`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [array.subject, array.group, array.std_no, array.std_name, array.std_score, array.personal_comment,array.team_comment])
  //}
  conn.release()
  res.status(200).send("success");
});

router.put('/enterscore/:subject', async function(req, res, next) { 
  const array = req.body.arr;
  const subject = req.params.subject
  console.log(subject)
  // const student = body.student
  console.log(array)
  console.log("11111111111")
  let conn = await pool.getConnection(async _conn => _conn)
  //for(var i = 0; i<array.length;i++){
    console.log(array.score_id)
    await conn.query('update fiveworks_aurora_db.`ksa_scoreInfo` set `group`=?, `std_no`=?, `name`=?, `score`=?, `personal_cmt`=?, `team_cmt`=? where `score_id`=?',
    [array.group, array.std_no, array.std_name, array.std_score, array.personal_comment,array.team_comment,array.score_id])
  //}
  conn.release()
  res.status(200).send("success");
});
//평가 성적 다운로드
router.post('/result/down', async (req, res, next) => {
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