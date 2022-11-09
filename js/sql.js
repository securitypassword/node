var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    database: "sql9540023",
    user: "sql9540023",
    password: "Y2TNk21TwE",
    port: 3306
  });
  


const executeStatement = async function(){
    console.log("connect uwu")
    var res=""
    con.query("SELECT * FROM `rol`;", await function (err, result, fields) {
        console.log("ahjskshjkhk")
        if (err){
          throw err
        };
        console.log("result");
        console.log(result);
        res=result
      });
      console.log(res)
    console.log("end connect uwu")
}
const sql = async function(command){
  console.log("connect uwu")
  console.log("sql "+command)
  var res=""
  res = con.query(command+";", await function (err, result, fields) {
      if (err){
        throw err
      };
      console.log("result from sql");
      console.log(result);
      return result
    })
  console.log("end connect uwu")
  return res
}
module.exports.executeStatement = executeStatement;
module.exports.sql = sql;