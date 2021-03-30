var express = require('express');
var router = express.Router();
var promiseMysql = require('mysql2/promise')

const pool = promiseMysql.createPool({
  connectionLimit: 70,
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
})

router.get('/board', async function(req, res, next) { 
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where `delete` != "T" order by board_id desc')
  conn.release()

  res.status(200).send(rows)
});

router.get('/board/:id/edit', async function(req, res, next) { 
  var id=req.params.id;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('select * from fiveworks_aurora_db.`ksa_board` where board_id ="'+id+'"')
  conn.release()

  res.status(200).send(rows)
});

router.post('/testInput/:subject', async function(req, res, next) { 
  var subject=req.params.subject;
  var body = req.body;
  let conn = await pool.getConnection(async _conn => _conn)
  let [rows] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content])
  conn.release()

  res.status(200).send();
});

router.post('/file/insert', async function(req, res, next) { 
  var files = req.files;


  // let conn = await pool.getConnection(async _conn => _conn)
  // let [rows] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content])
  // conn.release()

  res.status(200).send({files: files.map(_file => ({originalname: _file.originalname, filename: _file.filename}))});
});

router.get('/file/:filename', async function(req, res, next) { 
  var filename = req.params.filename;

  // let conn = await pool.getConnection(async _conn => _conn)
  // let [rows] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content])
  // conn.release()

  res.status(200).send();
});

router.post('/insert/:subject', async function(req, res, next) { 
  const body = req.body;
  const subject = req.params.subject
  const student = body.student

  let conn = await pool.getConnection(async _conn => _conn)
  let [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)',
    [student.name, student.std_no, subject, student.title, student.content])

  let sql = 'insert into fiveworks_aurora_db.`ksa_attachment`(board_id, filename, origin_filename, endpoint) values ('
  if(student.files.length) {
    student.files.forEach((file) => {
      console.log(file);
    })
  }
  // let [result] = await conn.query('?,?,?,?)',
  //   [result.insertId, ])
  conn.release()

  res.status(200).send();
});


module.exports = router;


  