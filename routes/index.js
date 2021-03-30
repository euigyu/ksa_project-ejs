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
      modulenames: modulenames
    }); 
  });
}); 
//실기평가 점수 입력 페이지
router.get('/:subject/enterscore', function(req, res, next) { 
  var subject = req.params.subject;
  dbcon.moduleName(subject, function(modulenames){
  res.render('board/enterScore', { 
    modulenames:modulenames,
    subject
  });
 });
});
//실기 평가 성정 입력
router.post("/:subject/enterscore", function (req, res) {
  var array = req.body.arr; 
  // console.log(array.length);
  var subject = req.params.subject;
  var str ="";
  console.log(subject);
  console.log()
  for(var i =0;i<array.length;i++){
    db.query('INSERT INTO fiveworks_aurora_db.`ksa_scoreInfo` (`subject`, `group`, `std_no`, `name`, `score`, `personal_cmt`, `team_cmt`) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [subject, array[i].group, array[i].std_no, array[i].std_name, array[i].std_score, array[i].personal_comment,array[i].team_comment], function () {
      res.status(200).send("succes");
    });
  };
});
// 실기 평가 성적 수정
router.post("/:subject/editscore/edit", function (req, res) {
  var array = req.body.arr; 
  var subject = req.params.subject;
  conssole(array);
  for(var i =0;i<array.length;i++){
    db.query('UPDATE fiveworks_aurora_db.`ksa_scoreInfo` SET `score`=?, `personal_cmt`=?, `team_cmt`=? WHERE `subject`=? and `std_no`=?',
    [array[i].std_score, array[i].personal_comment,array[i].team_comment,subject, array[i].std_no], function () {
      res.status(200).send("succes");
    });
  };
});

router.get('/onlineTest', function(req, res, next) { 
  dbcon.moduleList((modules) =>{ 
    res.render('onlineTest/moduleList', { 
      modules:modules 
    });
  }); 
});
router.get('/onlineTest/:subject/submit', function(req, res, next) { 
  var subject=req.params.subject;
  dbcon.moduleList(function (modules) {
      dbcon.moduleName(subject,function (modulenames) {
        console.log(modulenames);  
        res.render('onlineTest/testInput', {
            modules: modules,
            modulenames: modulenames
          });
        });
    }); 
});
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
});
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

router.get('/moduleList', function(req, res, next) { 
    dbcon.moduleList(function (modules) {
        res.render('board/moduleList', {
          modules: modules
        });
      }); 
});

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
//온라인 테스트
router.post("/testInput/:subject", function (req, res) {
  console.log("삽입 포스트 데이터 진행")
  var body = req.body;
  var subject = "선형대수학";
  db.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content], function () {
  res.redirect('/board');
  })
})
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
  })
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
  router.get('/board/:subject/:id', function(req, res, next) { 
  const id=req.params.id;
  const subject=req.params.subject;
  dbcon.contents(id, function (content) {
      console.log(content[0]);
      res.render('board/content', {
        content: content,
        subject
      });
    }); 
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


  