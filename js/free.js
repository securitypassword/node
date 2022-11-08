var sec = require("./sec")

var run = function(app){
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
      allowed += "!#$%&/()=?*";
    }
    //funeral vikingo
    /*
                      ||\\\
                      ||\\\\\
                      ||\/*\\\
                      ||\\\\\\\
                      ||
                      ||
          /*\         ||          /*\     /*\     /*\
    \\\\  if (req.query.rect == "true") {       \\\\\\
      \\\\\\  allowed += "■▀▄█▓▒░";}  /*\  \\\\\\\\\
          \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    */
    var len = parseInt(req.query.len);
    var pass = "";
  
    for (var i = 0; i < len; i++) {
      pass += allowed.charAt(Math.floor(Math.random() * allowed.length));
    }
    var passEn = sec.en(pass);
    res.json({
      data: passEn,
      msg: "random password",
    });
  });
}
module.exports.run = run;