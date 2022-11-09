const express = require("express");

var app = express();

const PORT = process.env.PORT;

//security
var sec = require("./js/sec")
var de = sec.de
var en = sec.en
//end of security

//global
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
//end of global

//database
const CyclicDB = require("cyclic-dynamodb")
const db = CyclicDB("bewildered-moth-cardiganCyclicDB")

var dbjs = require("./js/db")

 //users
const usersEmptyId=async function(){
  var newId=Math.floor(parseInt(Math.random()*10000))
  var empty=await users.get(newId.toString())
  while(empty!=null){
    newId=Math.random*10000
    newId=Math.floor(newId)
    empty=await users.get(newId.toString())
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
    let newUser= await users.set(id, {
      usu_name:name,
      usu_mpassword:mpass,
      usu_rol:"client",
      usu_autodel:"false",
      usu_autodel_count:0
      },{
      $index: ['usu_name']
    })    
    console.log("register "+newUser.toString())
  }
}

const loginUser=async function(name,mpass){
  var id="-1"
  let logUser= await users.index("usu_name").find(name)
  logUser=logUser.results[0]
  if(await userExists(name)){
    if(JSON.stringify(logUser.props.usu_mpassword)=='"'+mpass+'"'){
      var autoDel=JSON.stringify(logUser.props.usu_autodel)
      id={id:JSON.stringify(logUser.key),
        autodel:autoDel.toString()}
      await resetAutoDel(JSON.stringify(logUser.key))
      if(logUser.props.usu_rol=="admin"){
        var token=await sign({acess:JSON.stringify(logUser.key)})
        id.token=token
        console.log(JSON.stringify(logUser.key)+"'s token "+token)
      }
      console.log(JSON.stringify(logUser.props.usu_name)+" login "+id)
    }else{
      await addAutoDel(logUser.key)
    }
  }
  console.log(logUser+" "+id)
  return id
}
const userExists=async function(name){
  let logUser= await users.index("usu_name").find(name)
  logUser=logUser.results[0]
  return logUser!=void(0)
}
let users = db.collection('user')

app.get("/login", async (req, res, next) => {
  var usu = de(req.query.user);
  var pass = de(req.query.pass);
  var login= await loginUser(usu,pass)
  var resp=""
  var msg="404"
  console.log("login "+login)
  if(login!=-1){
    resp=login
    msg="200"
  }
  res.json({
    data:resp,
    msg:msg
  })
});
app.get("/register", async (req, res, next) => {
  var usu = de(req.query.user);
  var pass = de(req.query.pass);
  await registerUser(usu,pass)
  res.json({
    data:en("registered"),
    msg:""
  })
});

const addAutoDel=async function(usu_id){
  var id=usu_id
  var user=await users.get(id)
  if(user.props.usu_autodel=="true"){
    var count=user.props.usu_autodel_count
    count+=1
    await users.set(usu_id,{usu_autodel_count:count})
    console.log("add count autodelete "+usu_id+" to "+count)
    if(count>5){
      await deletePassFromUser(usu_id)
    }
  }
}

const resetAutoDel=async function(usu_id){
  await users.set(usu_id,{usu_autodel_count:0})
  console.log("reset count autodelete "+usu_id)
}

const changeAutoDel=async function(usu_id){
  var user=await users.get(usu_id)
  console.log("user "+usu_id)
  var auto=user.props.usu_autodel
  var change=auto=="true"
  change=!change
  auto=change.toString()
  await users.set(usu_id,{usu_autodel:auto})
  return auto
}

app.get("/changeAutoDel", async (req, res, next) => {
  var usu_id= req.query.usu_id
  var change=await changeAutoDel(usu_id)
  res.json({
    data:change,
    msg:"change the autodelete thingy"
  })
});

 //registers
let regs = db.collection('registers')

const registersEmptyId=async function(){
  var newId=parseInt(Math.random()*10000)
  newId=Math.floor(newId)
  var empty=await regs.get(newId.toString())
  while(empty!=null){
    newId=Math.random*10000
    newId=Math.floor(newId)
    empty=await regs.get(newId.toString())
  }
  return newId
}

const regExists= async function(usu_id, reg_name){
  var resp=false
  var regGet= await regByName(usu_id,reg_name)
  if(regGet!="-1"){
    resp=true
  }
  return resp
}

const passUsed= async function(usu_id, reg_pass){
  var resp=false
  var regsUser= await regsFromUser(usu_id)
  for(var r in regsUser){
    if(de(regsUser[r].reg_pass)==reg_pass){
      resp=true
    }
  }
  return resp
}

const regByName= async function(usu_id, reg_name){
  var resp="-1"
  var getReg= await regs.index("usu_id").find(usu_id)
  getReg=getReg.results
  for(var r in getReg){
    if(de(getReg[r].props.reg_name)==reg_name&&getReg[r].props.reg_in_bin==false){
      resp=getReg[r].key
    }
  }
  return resp
}

const registerPassword=async function(usuId,pass,name){
  var resp="registered"
  console.log("registering pass "+name)
  var id=await registersEmptyId()
  id=id.toString()
  var exists= await regExists(usuId, name)
  var passInUse= await passUsed(usuId, pass)
  console.log(exists)
  if(exists){
    id=await regByName(usuId, name)
    resp="updated"
  }
  console.log(id)
  if(passInUse){
    resp="already in use"
  }else{
    let newReg= await regs.set(id, {
      usu_id:usuId,
      reg_pass:en(pass),
      reg_name:en(name),
      reg_in_bin:false
      },{
      $index: ['usu_id']
    })    
    console.log("register "+newReg.toString())
  }
  return resp
}

const regsFromUser= async function(usu_id){
  var regsUser=await regs.index("usu_id").find(usu_id)
  regsUser=regsUser.results
  var resp={}
  for(var r in regsUser){
    resp[r.toString()]={}
    var reg=await regs.get(regsUser[r].key)
    var name=de(reg.props.reg_name)
    resp[r.toString()]["reg_name"]=en(name)
    var pass=de(reg.props.reg_pass)
    resp[r.toString()]["reg_pass"]=en(pass)
    var reg_id=regsUser[r].key
    resp[r.toString()]["reg_id"]=en(reg_id)
    var reg_in_bin=reg.props.reg_in_bin
    resp[r.toString()]["reg_in_bin"]=reg_in_bin
    console.log("reg at "+r+" "+name+" "+pass)
  }
  console.log("regs "+usu_id+" "+JSON.stringify(resp)) 
  return resp
}

const binFromUser= async function(usu_id){
  var regsUser=await regsFromUser(usu_id)
  var resp={}
  for(var r in regsUser){
    var inBin=regsUser[r].reg_in_bin
    if(inBin){
      resp[r]=regsUser[r]
    }
  }
  return resp
}

const activeRegsFromUser= async function(usu_id){
  var regsUser=await regsFromUser(usu_id)
  var resp={}
  for(var r in regsUser){
    var inBin=regsUser[r].reg_in_bin
    if(!inBin){
      resp[r]=regsUser[r]
    }
  }
  console.log("uwu "+JSON.stringify(resp))
  return resp
}

const deletePassFromUser=async function(usu_id){
  var regsUser=await regs.index("usu_id").find(usu_id)
  regsUser=regsUser.results
  for(var r in regsUser){
    var reg_id=regsUser[r].key
    regs.delete(reg_id)
  }
  console.log("delete from "+usu_id)
}

app.get("/getRegisters", async (req, res, next) => {
  var usu_id = req.query.usu_id;
  var registers = await activeRegsFromUser(usu_id)
  registers=JSON.stringify(registers)
  res.json({
    data:en(registers),
    msg:en("registers :3")
  })
});

app.get("/getPaperBin", async (req, res, next) => {
  var usu_id = req.query.usu_id;
  var registers = await binFromUser(usu_id)
  registers=JSON.stringify(registers)
  res.json({
    data:en(registers),
    msg:en("registers :3")
  })
});

const deleteRegister= async function(reg_id){
  var reg=await regs.get(reg_id)
  if(reg.props.reg_in_bin!=void(0)){
    var inBin=reg.props.reg_in_bin
    console.log("before "+JSON.stringify(reg))
    if(inBin){
      await regs.delete(reg_id)
      console.log("delete reg "+reg_id)
    }else{
      await regs.set(reg_id,{reg_in_bin:true})
    }
    reg=await regs.get(reg_id)
  }
  console.log("after "+JSON.stringify(reg))
}

app.get("/delRegister", async (req, res, next) => {
  var reg_id = req.query.reg_id;
  console.log(reg_id+" regDel")
  await deleteRegister(reg_id)
  res.json({
    data:en("del"),
    msg:en("delete")
  })
});

const restoreRegister= async function(reg_id){
  console.log("restoring "+reg_id)
  await regs.set(reg_id,{reg_in_bin:false})
}

app.get("/restoreRegister", async (req, res, next) => {
  var reg_id = req.query.reg_id;
  console.log(reg_id+" reg restore")
  await restoreRegister(reg_id)
  res.json({
    data:en("and again..."),
    msg:en("restore")
  })
});

app.get("/savePass", async (req, res, next) => {
  var usu_id=req.query.usu_id
  var newPass=de(req.query.pass)
  var choosenName=de(req.query.name)
  console.log("reg pass "+" "+usu_id+" "+newPass+" "+choosenName)
  var resp = await registerPassword(usu_id,newPass,choosenName)
  res.json({
    data:en(usu_id+" "+choosenName+" "+resp),
    msg:en("added")
  })
});

const initDB=async function(){
  await dbjs.delEverything()
  await registerGodess("demma","me girl")
}

const registerGodess=async function(name,mpass){
  var id="98"
  console.log("registering our queen "+name)
  let newUser= await users.set(id, {
    usu_name:name,
    usu_mpassword:mpass,
    usu_rol:"admin",
    usu_autodel:"false",
    usu_autodel_count:0
    },{
    $index: ['usu_name']
  })    
  console.log("register "+newUser.toString())
}

const isItTheKey=async function(contender){
  var res=contender=="ur mom"
  return res
}

app.get("/restart", async (req, res, next) => {
  var pass=de(req.query.key)
  var itsMe= await isItTheKey(pass)
  var resp=""
  if(itsMe){
    await initDB();
    resp="snap"
  }else{
    console.log("some fellow is tryng to erase evrthng")
    resp="ur not me"
  }
  res.json({
    data:resp,
    msg:"restart"
  })
});


//relational db
  var sql = require("./js/sql")
  app.post('/', function (req, res) {
    sql.executeStatement()
    res.send('POST request to the homepage');
  });
//end of relational

//end of database

//admin
/*
// library for generating symmetric key for jwt
const { createSecretKey } = require('crypto');
// library for signing jwt
const { SignJWT } = require('jose/jwt/sign');
// library for verifying jwt
const { jwtVerify } = require('jose/jwt/verify');

let tokens = db.collection('tokens')

var privateKey="hi gay im dad"
*/
const sign= async function(toDo){
  /*
  const secretKey = createSecretKey(CryptoJS.SHA3(privateKey), 'utf-8');
  
  const token = await new SignJWT({ id: CryptoJS.SHA3(toDo) }) // details to  encode in the token
      .setProtectedHeader({ alg: 'HS256' }) // algorithm
      .setIssuedAt()
      .setIssuer("Server") // issuer
      .setAudience("Client") // audience
      .setExpirationTime("2 hours") // token expiration time, e.g., "1 day"
      .sign(secretKey); // secretKey generated from previous step
  console.log(token); // log token to console

  return token
  */
}

const isAdminn= async function(usu_id){
  var resp=false
  var usu= await users.get(usu_id)
  if(usu.props!=null){
    if(usu.props.usu_rol=="admin"){
      return true;
    }
  }
  if(!resp){
    console.log("some foe is tryin to be admin "+usu_id)
  }
  return resp
}

app.get("/admin", async (req, res, next) => {
  var usuId= req.query.usu_id
  var isAdmin= await isAdminn(usuId)
  var resp=""
  if(isAdmin){
    resp="<h1>u admin</h1>"
  }else{
    resp="<div>not today</div>"
  }
  res.json({
    data:resp,
    msg:"admin?"
  })
});

//end of admin

//create password
var free= require("./js/free")
free.run(app)

//encode service bc im lazy gurl
app.get("/encode", (req, res, next) => {
  res.json({
    data:en(req.query.enc),
    msg:"encode"});
});

//test
app.get("/", async (req, res, next) => {
  await sql.executeStatement()
  const us = require("./js/db/user")
  user.registerUser("name","pass")
  res.json({msg:"welcome :3"});});

//run this sheet
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
