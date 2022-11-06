import { Connection } from 'tedious';  
var config = {  
    server: 'sql9.freemysqlhosting.net',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'sql9540023', //update me
            password: 'Y2TNk21TwE'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'sql9540023'  //update me
    }
};
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected");  
    executeStatement();  
});  

connection.connect();

import { Request } from 'tedious';  
import { TYPES } from 'tedious';  

function executeStatement() {  
    request = new Request("SELECT SELECT * FROM `rol`;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}  

const _executeStatement = executeStatement;
export { _executeStatement as executeStatement };