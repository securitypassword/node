var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    database: "sql9540023",
    user: "sql9540023",
    password: "Y2TNk21TwE",
    port: 3306
  });
  


const executeStatement = async function(){
    console.log("connect uwu test")
    var res=""
    await con.query("SELECT * FROM `rol`;", await function (err, result, fields) {
        if (err){
          throw err
        };
        console.log("result");
        console.log(result);
        res=result
      });
      console.log(res)
    console.log("end connect uwu test")
    return res
}
const sql = async function(command){
  let test = await executeStatement()
  console.log(test)
  console.log("connect uwu")
  console.log("sql "+command)
  var res=[]
  var query = con.query(command+";")
  await query.on('error', function(err) {
    console.log("error: "+err)
  })
  .on('fields', function(fields) {})
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    con.pause();
 
    console.log("rows")
    console.log(row)
    res.push(row)
    con.resume();
  })
  .on('end', function() {
    console.log("end connect uwu")
  });
  console.log("result sql")
  console.log(res)
  await executeStatement()
  return res
}
module.exports.executeStatement = executeStatement;
module.exports.sql = sql;