var express = require('express');
var router = express.Router();
var axios = require('axios');
const config = require('../config')

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
    res.render('onlineTest/testView', { 
      rows: [] 
    });
  // }); 
});

router.get('/board',async function(req, res, next) { 
  console.log("나와");
  const posts = await axios.get(`${config.dbIp}/api/board`);
  res.render('board/board', { 
    posts: posts.data
  });
});

router.get('/board/new', function(req, res, next) { 
    res.render('board/new', { 
      posts: [] 
    });
});

router.get('/board/:id/edit', async function(req, res, next) { 
    var id=req.params.id
    const content = await axios.get(`${config.dbIp}/api/board/${id}/edit`);
    res.render('board/edit', {
      content: content.data
    });
});

router.post("/testInput/:subject",async function (req, res) {
  // var body = req.body;
  var subject = "선형대수학";
  const content = await axios.post(`${config.dbIp}/api/testInput/${subject}`);
  // db.query('insert into fiveworks_aurora_db.`ksa_board`(name,std_no,subject,title,content,create_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)', [body.name, body.std_no, subject, body.title, body.content], function () {
  res.redirect('/board');
});

 //게시글 등록
router.post("/insert", async function (req, res) {
  // var body = req.body;
  // var data = req.body;
  // console.log(data);
  var subject = "linear";
  await axios.post(`${config.dbIp}/api/insert/${subject}`);
  res.send('/board');
});
//게시글 수정
router.post('/edit/:id', async function(req, res, next) { 
  var id=req.params.id
  var body = req.body;
  db.query('update fiveworks_aurora_db.`ksa_board` set name = ? , std_no = ?, title = ?, content = ?, update_at = CURRENT_TIMESTAMP where board_id = ?', [body.name, body.std_no, body.title, body.content, id], function () {
  res.redirect('/board');
  })
});
// 게시글 삭제
router.post('/board/:id/delete', async function(req, res, next) { 
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


  