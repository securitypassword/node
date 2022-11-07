var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    user: "sql9540023",
    password: "Y2TNk21TwE"
  });
  


const executeStatement = function(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}
module.exports.executeStatement = executeStatement;