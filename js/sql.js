const {Connection, Request} = require("tedious");
const executeSQL = (sql, callback) => {
  let connection = new Connection({
    "authentication": {
      "options": {
        "userName": "sql9540023",
        "password": "Y2TNk21TwE"
      },
      "type": "default"
    },
    "server": "sql9.freemysqlhosting.net",
    "options": {
      "validateBulkLoadParameters": false,
      "rowCollectionOnRequestCompletion": true,
      "database": "sql9540023",
      "port" : "3306",
      "encrypt": true
    }
  });
  connection.connect((err) => {
    if (err)
      return callback(err, null);
    const request = new Request(sql, (err, rowCount, rows) => {
      connection.close();
      if (err)
        return callback(err, null);
      callback(null, {rowCount, rows});
    });
    connection.execSql(request);
  });
};
const executeStatement = function(){
    executeSQL("SELECT * FROM rol", (err, data) => {
    if (err)
        console.error(err);
        console.log("sql uwu")
    console.log(data);
    });
}
module.exports.executeStatement = executeStatement;