//jshint esversion:6
const express = require ("express")
const bodyParser =require("body-parser")
const ejs = require("ejs")
const app= express();
const mongoose = require ("mongoose");
const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/secretuserDB",{useNewUrlParser: true});

const userSchema= new mongoose.Schema({
  email:String,
  password:String
});

const secret ="Thisisoutlittlesecret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"] });


const User= new mongoose.model("User",userSchema);

app.use(express.static("public"));

app.set('view engine',"ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const username= req.body.username;
  const password = req.body.password;
  User.findOne({email:req.body.username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
        else{
          res.redirect("/login");
        }
      }else{
        res.redirect("/register");
      }

    }
  });
});
app.get("/logout",function(req,res){
  res.redirect("/");
})
app.listen(3000,function(){
  console.log("Server started at port 3000");
})
