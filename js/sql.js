var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    database: "sql9540023",
    user: "sql9540023",
    password: "Y2TNk21TwE",
    connectTimeout: 5000,
    port: 3306
  });
  


const executeStatement = function(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}
module.exports.executeStatement = executeStatement;