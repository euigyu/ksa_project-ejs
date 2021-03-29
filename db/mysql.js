const mysql      = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
const db = mysql.createConnection({
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
});
// function lectureList(callback){ 
//   db.query('SELECT sub, sub_detail, sub_link FROM fiveworks_aurora_db.`ksa_lecture` where sub="선형대수학"', (err, rows) => {
//      if(err){
//       throw err;
//      }  
//      callback(JSON.parse(JSON.stringify(rows))); 
//     }); 
//   }
function lectureList(lecture, callback){ 
  db.query('SELECT * FROM fiveworks_aurora_db.`ksa_lectureList` where sub_eng="' + lecture + '"', (err, rows) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(rows))); 
    }); 
    }
function lectureLink(lecture,id,callback){
  db.query('SELECT sub_link FROM fiveworks_aurora_db.`ksa_lectureList` where sub_eng="' + lecture + '"and id='+id+' ', (err, links) => {
    if(err){
     throw err;      
    }  
    callback(JSON.parse(JSON.stringify(links))); 
   });
}
function boardList(callback){ 
  db.query('select * from fiveworks_aurora_db.`ksa_board` where `delete` != "T" order by board_id desc' , (err, posts) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(posts))); 
    }); 
}  
function contents(id, callback){ 
  db.query('select * from fiveworks_aurora_db.`ksa_board` where board_id ="'+id+'"' , (err, content) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(content))); 
    }); 
}  
module.exports = {
  lectureList,
  lectureLink,
  boardList,
  contents
}
