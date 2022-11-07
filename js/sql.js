var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    database: "sql9540023",
    user: "sql9540023",
    password: "Y2TNk21TwE",
    connectTimeout: 10000,
    port: 3306
  });
  


const executeStatement = function(){
    console.log("connect uwu")
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
      console.log("end connect uwu")
}
module.exports.executeStatement = executeStatement;