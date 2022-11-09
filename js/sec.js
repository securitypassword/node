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

  function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }
  function fromBinary(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }

  function hash(text){
    return CryptoJS.SHA256(text)
  }


  module.exports.de = de;
  module.exports.en = en;
  module.exports.toBinary = toBinary;
  module.exports.fromBinary = fromBinary;
  module.exports.hash = hash;