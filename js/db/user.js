var sec = require("../sec")

//sql

var sql= require("../sql")

const userExists = async function(name){
    let command='SELECT * FROM `usuario` WHERE `usu_nombre`="'+sec.toBinary(name)+'"'
    let res = await sql.sql(command)
    let exists=res!=""
    console.log(res)
    console.log("user exists?")
    console.log(exists)    
    return exists
}

const usersEmptyId = async function(){
  console.log("user empty id")
    let newId=1
    let empty="a"
    while(empty!=""){
      newId=Math.floor(parseInt(Math.random()*10000))
      let command='SELECT * FROM `usuario` WHERE `usu_id`="'+newId+'"'
      empty=await sql.sql(command)
      console.log(empty)
      console.log("empty")
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

const loginUser=async function(name,mpass){
  let command='SELECT `usu_id` FROM `usuario` WHERE `usu_nombre`="'+sec.toBinary(name)+'"'
  let quest=await sql.sql(command)
  console.log("login sql")
  console.log(quest)
}
module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;