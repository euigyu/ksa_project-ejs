const promiseMysql = require('mysql2/promise')

module.exports = promiseMysql.createPool({
  connectionLimit: 70,
  host     : 'fiveworks-instance-1.cbth2mnfdm9m.ap-northeast-2.rds.amazonaws.com',
  user     : 'wilshere',
  password : 'fiveworks',
//   database : '-'
})