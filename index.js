const express = require("express");

var app = express();

const PORT = process.env.PORT || 420;

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get("/", (req, res, next) => {
  res.json({ 
    data : "never gonna give you up",
    message: "lel" });
});
app.post("/", function (req, res, next) {
  // Handle the post for this route
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
