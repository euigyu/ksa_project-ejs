const mysql      = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
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
})
function moduleList(callback){ 
  db.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList`', (err, modules) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(modules))); 
    }); 
 }
 function moduleName(sub, callback){ 
  db.query('SELECT * FROM fiveworks_aurora_db.`ksa_moduleList` where module_eng = "'+sub+'"', (err, subject) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(subject))); 
    }); 
 }
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
function boardList(sub,callback){ 
  db.query('select * from fiveworks_aurora_db.`ksa_board` where subject = "'+sub+'" and `delete` != "T" order by board_id desc' , (err, posts) => {
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
function scoreInfo(id, callback){ 
  db.query('select * from fiveworks_aurora_db.`ksa_scoreInfo` where subject ="'+id+'"' , (err, scores) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(scores))); 
    }); 
}
function onlineTestList(subject, callback){ 
  let sql = 'select ot.subject, ot.q_no, ot.question, ot.`comment`, group_concat(mul.m_no) as m_nos, group_concat(mul.choice) as choices from fiveworks_aurora_db.ksa_onlineTest as ot, fiveworks_aurora_db.ksa_multipleChoice as mul where ot.q_no = mul.q_no and'
  sql += ' ot.subject = "' + subject + '" group by ot.q_no'
  db.query(sql , (err, question) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(question))); 
    }); 
  // db.query('select * from fiveworks_aurora_db.`ksa_onlineTest` where subject ="'+id+'"' , (err, question) => {
  //    if(err){
  //     throw err;      
  //    }  
  //    callback(JSON.parse(JSON.stringify(question))); 
  //   }); 
}
// function multipleChoiceList(id, callback){ 
//   db.query('select * from fiveworks_aurora_db.`ksa_multipleCoice` where subject ="'+id+'"' , (err, multiples) => {
//      if(err){
//       throw err;      
//      }  
//      console.log(multiples);
//      for(var i=0; i< multiples.length; i++){
//        console.log(multiples);

//      }
//      callback(JSON.parse(JSON.stringify(multiples))); 
//     }); 
// }
function multipleChoiceList(id, callback){ 
  db.query('select * from fiveworks_aurora_db.`ksa_multipleChoice` where q_no="'+id+'"' , (err, multiples) => {
     if(err){
      throw err;      
     }  
    //  console.log(multiples);
    //  for(var i=0; i< multiples.length; i++){
    //    console.log(multiples[i]);

    //  }
     callback(JSON.parse(JSON.stringify(multiples))); 
    }); 
}
function testcheck(callback){ 
  db.query('select m_no, q_no from fiveworks_aurora_db.ksa_multipleChoice where answer="t"' , (err, callback) => {
     if(err){
      throw err;      
     }  
     callback(JSON.parse(JSON.stringify(callback))); 
    }); 
}

module.exports = {
  lectureList,
  lectureLink,
  boardList,
  contents,
  moduleList,
  moduleName,
  scoreInfo,
  onlineTestList,
  multipleChoiceList,
  testcheck
}
