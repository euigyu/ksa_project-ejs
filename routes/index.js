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
//실기 평가 성정 입력 ajax통신
router.post("/:subject/enterscore", function (req, res) {
 subject = req.params.subject;
 var array = req.body.arr; 
  var str ="";
  // console.log(subject);
  for(var i =0;i<array.length;i++){
    db.query('INSERT INTO fiveworks_aurora_db.`ksa_scoreInfo` (`subject`, `group`, `std_no`, `name`, `score`, `personal_cmt`, `team_cmt`) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [subject, array[i].group, array[i].std_no, array[i].std_name, array[i].std_score, array[i].personal_comment,array[i].team_comment], function () {
      res.status(200).send("succes");
    });
  };
});
// 실기 평가 성적 수정 ing...
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
//필기평가 모듈 선택페이지
router.get('/onlineTest', function(req, res, next) { 
  dbcon.moduleList((modules) =>{ 
    res.render('onlineTest/moduleList', { 
      modules:modules 
    });
  }); 
})
//필기 평가 페이지
router.get('/onlineTest/:subject', function(req, res, next) { 
  var subject=req.params.subject;
  dbcon.moduleList(function (modules) {
      dbcon.moduleName(subject,function (modulenames){
        dbcon.onlineTestList(subject,function(questions){
        console.log(questions);  
        res.render('onlineTest/testpage', {
            modules: modules,
            modulenames: modulenames,
            questions: questions,
            subject
          });
        });
      });
    }); 
})
//필기 평가 문제입력 페이지
router.get('/onlineTest/:subject/submit', function(req, res, next) { 
  var subject=req.params.subject;
  dbcon.moduleList(function (modules) {
      dbcon.moduleName(subject,function (modulenames) {
        console.log(modulenames);  
        res.render('onlineTest/testInput', {
            modules: modules,
            modulenames: modulenames,
            subject
          });
        });
    }); 
})
//필기 평가 문제 입력 ajax처리
router.post('/onlineTest/:subject/testinput', function(req, res, next){
  var subject=req.params.subject;
  subject = req.params.subject;
  var array = req.body.arr; 
  console.log(array);
  for(var i =0;i<array.length;i++){
    let[result] = db.query('INSERT INTO fiveworks_aurora_db.ksa_onlineTest (`subject`, `question`, `comment`) VALUES (?, ?, ?);',
    [subject, array[i].question, array[i].question_comment], function () {
      console.log(result);
      // res.status(200).send("succes");
    });
    // let conn = await pool.getConnection(async _conn => _conn)
    // let [result] = await conn.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)',
    //   [student.name, student.std_no, subject, student.title, student.content])
  
    // if(student.files.length) {
    //   let sql = 'insert into fiveworks_aurora_db.`ksa_attachment`(board_id, filename, originalname, endpoint) values '
    //   student.files.forEach((file, idx) => {
    //     sql += `(${result.insertId}, '${file.filename}', '${file.originalname}', '${config.fileApi}')`
    //     if(student.files.length - 1 != idx) {
    //       sql += ','
    //     }
    //   })
    //   await conn.query(sql)
    // }
  
    // conn.release()
  
    // res.status(200).send();
  };
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


  