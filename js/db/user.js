var sec = require("../sec")

//sql

var sql= require("../sql")

const userExists = async function(name){
    let command="SELECT * FROM `usuario` WHERE `usu_nombre`=`"+sec.toBinary(name)+"`"
    let res = await sql.sql(command)
    console.log("user exists?")
    console.log(res)    
    return res!=void(0)
}

const usersEmptyId = async function(name){
    let newId=1
    let empty=void(0)
    while(empty!=void(0)){
      newId=Math.random*1000000
      newId=Math.floor(newId)
      let command='SELECT * FROM `usuario` WHERE `usu_nombre`="'+newId+'"'
      empty=await sql.sql(command)
    }
    return newId
}

const registerUser=async function(name,mpass){
  console.log("registering "+name)
  var exists=await userExists(name)
  if(!exists){
    var id=await usersEmptyId()
    id=id.toString()
    console.log(id)
    let command='INSERT INTO `usuario`(`usu_id`, `usu_nombre`, `usu_mpassword`, `usu_autodestruccion`, `usu_autodel_count`, `usu_status`, `rol_id`)'
    command+='VALUES ('+id+',"'+sec.toBinary(name)+'","'+sec.hash(mpass)+'","F",0,"active",1)'
    await sql.sql(command)
  }
}
module.exports.registerUser = registerUser;