require("dotenv").config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds=10;

const app=express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

/* old method */
// const userSchema={
//   email:String,
//   password:String
// };
// const User=mongoose.model("User",userSchema);

/* new method encryption*/
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=mongoose.model("User",userSchema);


app.get("/",function (req,res){
  res.render("home");
});



app.get("/login",function (req,res){
  res.render("login");
});

app.post("/login",function (req,res){
  const username=req.body.username;
  //const password=md5(req.body.password);

  User.findOne({email:username},function (err,foundUser){
    if(err){
      res.send(err);
    }
    else{
      if(foundUser){
        // if(foundUser.password==password){
        //   res.render("secrets");
        // }
        // else{
        //   res.send("Incorrect password.");
        // }

        bcrypt.compare(req.body.password,foundUser.password,function (err,result){
          if(result==true){
            res.render("secrets");
          }
          else{
            res.send("Incorrect password.");
          }
        });
      }
      else{
        res.send("Check username and password.");
      }
    }
  });
});



app.get("/register",function (req,res){
  res.render("register");
});

app.post("/register",function (req,res){

  /* bcrypt hashing used */
  bcrypt.hash(req.body.password,saltRounds,function (err,hash){
    // err ignored here.
    const newUser=new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function (err){
      if(err){
        res.send(err);
      }
      else{
        res.render("secrets");
      }
    });
  });

  /* md5 hashing used */
  // const newUser=new User({
  //   email:req.body.username,
  //   password:md5(req.body.password)
  // });
  // newUser.save(function (err){
  //   if(err){
  //     res.send(err);
  //   }
  //   else{
  //     res.render("secrets");
  //   }
  // });
});







app.listen(3000,function (){
  console.log("Server is running on Port 3000...");
});
