var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    database: "sql9540023",
    user: "sql9540023",
    password: "Y2TNk21TwE",
    port: 3306
  });
  


const executeStatement = function(){
    console.log("connect uwu")
    con.query("SELECT * FROM rol", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    console.log("end connect uwu")
}
module.exports.executeStatement = executeStatement;