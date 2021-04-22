//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if (!err){
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = hash;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
        res.render(err);
      } else {
      bcrypt.compare(req.body.password, hash, function(err, result) {
        if (result===true) {
          if (foundUser.password === hash){

            res.render("secrets");
          }
        }
      });
    }
  });
});


// <-------------------------------server listening on this port------------------------------------------>
app.listen(3000, function(req, res){
  console.log("server started on port 3000.");
});
