//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "hardtohackpassword.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (!err){
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      res.render(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password){

          res.render("secrets");
        }
      }
    }
  });
});


// <-------------------------------server listening on this port------------------------------------------>
app.listen(3000, function(req, res){
  console.log("server started on port 3000.");
});
