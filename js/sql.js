var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
  });
  


const executeStatement = function(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}
module.exports.executeStatement = executeStatement;