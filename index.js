const express = require("express");

var app = express();

const PORT = process.env.PORT;

//security
var CryptoJS = require("crypto-js");
var key = "i forgor :skull:";

function de(text) {
  return CryptoJS.DES.decrypt(
    text.replace(/-/g, "+").replace(/_/g, "/"),
    key
  ).toString(CryptoJS.enc.Utf8);
};
function en(text) {
  return CryptoJS.DES.encrypt(text, key)
    .toString()
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
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

const logEverything= async function(){
  var usersFull= await users.list()
  usersFull=usersFull.results
  for(var reg in usersFull){
    var regFromUsers=await users.get(usersFull[reg].key.toString())
    console.log("reg "+JSON.stringify(usersFull[reg])+" = "+JSON.stringify(regFromUsers))
    console.log("name "+regFromUsers.props.usu_name.toString())
  }
  var regsFull= await users.list()
  regsFull=regsFull.results
  for(var reg in regsFull){
    var regFromUsers=await regs.get(regsFull[reg].key.toString())
    console.log("reg "+JSON.stringify(regsFull[reg])+" = "+JSON.stringify(regFromUsers))
    console.log("name "+regFromUsers.props.reg_name.toString())
    console.log("pass "+regFromUsers.props.reg_pass.toString())
  }
}
const delEverything= async function(){
  console.log("im die thank you foreva")
  var usersFull= await users.list()
  usersFull=usersFull.results
  for(var reg in usersFull){
    console.log("num "+reg.toString())
    console.log("key "+usersFull[reg].key.toString())
    users.delete(usersFull[reg].key.toString())
    console.log("usu "+JSON.stringify(usersFull[reg]))
  }
}

 //users
const usersEmptyId=async function(){
  var newId=parseInt(Math.random()*10000)
  newId=Math.floor(newId)
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
      console.log(JSON.stringify(logUser.props.usu_name)+" login "+id)
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
//const users=require("./db/users.json")

const setAutoDel=async function(usu_id){

}

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

const changeAutoDel=async function(usu_id){
  var user=await users.get(usu_id)
  console.log("user "+JSON.stringify(user))
  var auto=user.props.usu_autodel
  var change=auto=="true"
  change=!change
  auto=change.toString()
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

const regByName= async function(usu_id, reg_name){
  var resp="-1"
  var getReg= await regs.index("usu_id").find(usu_id)
  getReg=getReg.results
  for(var r in getReg){
    if(de(getReg[r].props.reg_name)==reg_name){
      resp=getReg[r].key
    }
  }
  return resp
}

const registerPassword=async function(usuId,pass,name){
  console.log("registering pass "+name)
  var id=await registersEmptyId()
  id=id.toString()
  exists= await regExists(usuId, name)
  console.log(exists)
  if(exists){
    id=await regByName(usuId, name)
  }
  console.log(id)
  let newReg= await regs.set(id, {
    usu_id:usuId,
    reg_pass:en(pass),
    reg_name:en(name)
    },{
    $index: ['usu_id']
  })    
  console.log("register "+newReg.toString())
}

const regsFromUser= async function(usu_id){
  var regsUser=await regs.index("usu_id").find(usu_id)
  regsUser=regsUser.results
  var resp={}
  for(var r in regsUser){
    resp[r.toString()]={}
    var name=de(regsUser[r].props.reg_name)
    resp[r.toString()]["reg_name"]=en(name)
    var pass=de(regsUser[r].props.reg_pass)
    resp[r.toString()]["reg_pass"]=en(pass)
    var reg_id=regsUser[r].key
    resp[r.toString()]["reg_id"]=en(reg_id)
    console.log("reg at "+r+" "+name+" "+pass)
  }
  console.log("regs "+usu_id+" "+JSON.stringify(resp)) 
  return resp
}

app.get("/getRegisters", async (req, res, next) => {
  var usu_id = req.query.usu_id;
  var registers = await regsFromUser(usu_id)
  registers=JSON.stringify(registers)
  res.json({
    data:en(registers),
    msg:en("registers :3")
  })
});

const deleteRegister= async function(reg_id){
  await regs.delete(reg_id)
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

app.get("/savePass", async (req, res, next) => {
  var usu_id=req.query.usu_id
  var newPass=de(req.query.pass)
  var choosenName=de(req.query.name)
  console.log("reg pass "+" "+usu_id+" "+newPass+" "+choosenName)
  await registerPassword(usu_id,newPass,choosenName)
  res.json({
    data:en(usu_id+" "+choosenName),
    msg:en("added")
  })
});

const initDB=async function(){
  await delEverything()
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

//end of database

//create password
app.get("/generate", (req, res, next) => {
  var allowed = "";
  if (req.query.low == "true") {
    allowed += "abcdefghijklmnopqrstuvwxyz";
  }
  if (req.query.up == "true") {
    allowed += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (req.query.n == "true") {
    if (req.query.low == "true") {
      allowed += "ñæç";
    }
    if (req.query.up == "true") {
      allowed += "ÑÆÇ";
    }
    allowed += "";
  }
  if (req.query.num == "true") {
    allowed += "1234567890";
  }
  if (req.query.char == "true") {
    allowed += "!#$%&/()=?";
  }
  if (req.query.rect == "true") {
    allowed += "■▀▄█▓▒░";
  }
  var len = parseInt(req.query.len);
  var pass = "";

  for (var i = 0; i < len; i++) {
    pass += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  var passEn = en(pass);
  res.json({
    data: passEn,
    msg: "random password",
  });
});

//encode service bc im lazy gurl
app.get("/encode", (req, res, next) => {
  res.json({
    data:en(req.query.enc),
    msg:"encode"});
});

//test
app.get("/", (req, res, next) => {
  res.json({msg:"welcome :3"});});

//run this sheet
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});