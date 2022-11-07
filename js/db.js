var sec = require("./sec")
const CyclicDB = require("cyclic-dynamodb")
const db = CyclicDB("bewildered-moth-cardiganCyclicDB")
let users = db.collection('user')

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
  
module.exports.logEverything = logEverything;
module.exports.delEverything = delEverything;