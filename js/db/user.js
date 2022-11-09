var sec = require("../sec")

//sql

var sql= require("../sql")

const registerUser=async function(name,mpass){
  console.log("registering "+name)
  var exists=await userExists(name)
  if(!exists){
    var id=await usersEmptyId()
    id=id.toString()
    console.log(id)
    let command="INSERT INTO `usuario`(`usu_id`, `usu_nombre`, `usu_mpassword`, `usu_autodestruccion`, `usu_autodel_count`, `usu_status`, `rol_id`)" 
    command+="VALUES ("+id+","+sec.toBinary(name)+","+sec.hash(mpass)+",`F`,0,`active`,1)"
    await sql.sql(command)
  }
}

module.exports.registerUser = registerUser;