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
  var query = con.query(command+";")
  .on('error', function(err) {
    console.log("error: "+err)
  })
  .on('fields', function(fields) {})
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    con.pause();
 
    processRow(row, function() {
      console.log("rows")
      console.log(row)
      con.resume();
    });
  })
  .on('end', function() {
    console.log("end connect uwu")
  });
  return res
}
module.exports.executeStatement = executeStatement;
module.exports.sql = sql;