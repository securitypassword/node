var CryptoJS = require("crypto-js");
var key = "i forgor :skull:";

var de = function(text) {
    return CryptoJS.DES.decrypt(
      text.replace(/-/g, "+").replace(/_/g, "/"),
      key
    ).toString(CryptoJS.enc.Utf8);
  };
  var en = function (text) {
    return CryptoJS.DES.encrypt(text, key)
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  
module.exports.de = de;
module.exports.en = en;