var express = require('express');
var router = express.Router();
const mysql= require('mysql');
const dbcon = require('../db/mysql'); // db 모듈 추가 /* GET home page. */  
const db = mysql.createConnection({
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
});
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { 
//     title: 'Express' });
// });
router.get('/', function(req, res, next) { 
    res.render('home', { 
      rows: []
  }); 
}); 
router.get('/onlineTest', function(req, res, next) { 
  // db.lectureList((rows) =>{ 
    // console.log(rows);
    res.render('onlineTest/testView', { 
      rows: [] 
    });
  // }); 
});

router.get('/board', function(req, res, next) { 
  dbcon.boardList((posts) =>{ 
    res.render('board/board', { 
      posts: posts 
    });
  }); 
});

router.get('/board/new', function(req, res, next) { 
  // db.lectureList((rows) =>{ 
    // console.log(rows);
    res.render('board/new', { 
      posts: [] 
    });
  // }); 
});

router.get('/board/:id/edit', function(req, res, next) { 
    var id=req.params.id
    dbcon.contents(id, function (content) {
      console.log(content[0]);
      res.render('board/edit', {
        content: content
      });
    }); 
});
router.post("/testInput/:subject", function (req, res) {
  console.log("삽입 포스트 데이터 진행")
  var body = req.body;
  var subject = "선형대수학";
  db.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content], function () {
  res.redirect('/board');
  })
})
 //게시글 등록
router.post("/insert", function (req, res) {
  console.log("삽입 포스트 데이터 진행")
  var body = req.body;
  var subject = "선형대수학";
  db.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content], function () {
  res.redirect('/board');
  })
})
//게시글 수정
router.post('/edit/:id', function(req, res, next) { 
  var id=req.params.id
  var body = req.body;
  db.query('update fiveworks_aurora_db.`ksa_board` set name = ? , std_no = ?, title = ?, content = ?, update_at = CURRENT_TIMESTAMP where board_id = ?', [body.name, body.std_no, body.title, body.content, id], function () {
  res.redirect('/board');
  })
});
// 게시글 삭제
router.post('/board/:id/delete', function(req, res, next) { 
  const id=req.params.id
  db.query('update fiveworks_aurora_db.`ksa_board` set `delete` = "T" , delete_at = CURRENT_TIMESTAMP where board_id = ?', [id], function () {
    res.redirect('/board');
    })
  });;
router.get('/board/:id', function(req, res, next) { 
  const id=req.params.id
  dbcon.contents(id, function (content) {
      console.log(content[0]);
      res.render('board/content', {
        content: content
      });
    }); 
});

router.get('/:lecture/:id', function(req, res, next) { 
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


  