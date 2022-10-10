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

 //users
let users = db.collection('user')
//const users=require("./db/users.json")
function getNameById(id){
  var res = users.get(id)
  return res
}
function getByName(name){
  var res=-1
  for(var reg in users){
    console.log(users.get(reg))
    if(users.get(reg).usu_name==name){
      res=reg;
    }
  }
  return res
}

app.get("/login", (req, res, next) => {
  var usu = de(req.query.user);
  var resp=""
  var srch=getByName(usu);
  console.log(usu+" usu?");
  if(srch!=-1){
    if(de(req.query.pass)==users.get(srch).usu_mpassword){
      resp=users.get(srch).usu_id
    }
  }
  console.log(db)
  res.json({
    data: resp,
    msg: "login"
  });
});
app.get("/register", (req, res, next) => {
  var usu = de(req.query.user);
  var pass = de(req.query.pass);
  var resp=""
  if(getByName(usu)==-1&&usu!=""&&pass!=""){
    console.log("register "+usu+" "+pass);
    var newId= Math.round(Math.random()*10000)
    while(getNameById(newId)!=-1&&getByName(usu)!=-1){
      newId= Math.round(Math.random()*10000)
    }
    newId=newId.toString()
    let newReg = users.set(newId, {
      usu_name: en(usu),
      usu_mpassword: en(pass)
    })
    resp="success"
  }else{
    resp="successn't"
  }
  res.json({
    data: en(resp),
    msg: en(newId)
  });
});


 //registers
//const regs=db.collection("register");
const regs=require("./db/registers.json")

function getRegsFromId(id){
  var regIds = []
  for(var reg in regs){
    if(regs[reg].usu_id==id){
      regIds.push(reg)
    }
  }
  return regIds
}

app.get("/getRegisters", (req, res, next) => {
  var usu_id = req.query.usu_id;
  var usu_regs=getRegsFromId(usu_id)
  var resp=[]
  for(var r in usu_regs){
    resp.push('"'+usu_regs[r]+'":'+JSON.stringify(regs[usu_regs[r]]))
  }
  res.json({
    data: en("{"+resp.toString()+"}"),
    msg: "regs"
  });
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
  } //nice
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
