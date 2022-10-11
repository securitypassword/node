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
  console.log(usersFull)
}
const delEverything= async function(){
  var usersFull= await users.list()
  usersFull=usersFull.results
  console.log("usu "+usersFull.toString())
  users.delete('775.5248405884552')
}


 //users
let users = db.collection('user')
//const users=require("./db/users.json")


app.get("/login", async (req, res, next) => {
  await logEverything()
  await delEverything()
  res.json({
    data:req.query.user,
    msg:"lel"
  })
});
app.get("/register", (req, res, next) => {
  var usu = de(req.query.user);
});


 //registers
//const regs=db.collection("register");
const regs=require("./db/registers.json")

app.get("/getRegisters", (req, res, next) => {
  var usu_id = req.query.usu_id;

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
