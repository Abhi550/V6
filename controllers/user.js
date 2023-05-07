const mongoose = require("mongoose");
const User = require('../models/user');
const Product = require('../models/products');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const products = require("../models/products");


const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    //maxAge: 1000000000,
    signed: true 
  };

exports.logIn = (req , res , next) => {
    return res.render('./login' , {note : "no"});
};

exports.signin = (req , res , next) => {
  console.log("entered signin")
  console.log(req.body.password)
  User.find({ gmail: req.body.gmail })
      .exec()
      .then(user => {
        console.log(user.length)
        if (user.length < 1) {
            return res.render('./login' , {note : "incorrect gmail"})
        }
        if(user[0].password == req.body.password)
        {
          console.log("i am in sign in");
          var token = jwt.sign({ gmail : user[0].gmail}, "secret3256");
            res.cookie('token', token, cookieConfig);
            res.cookie('name', user[0].name, cookieConfig );
            return res.status(200).redirect('/dashboard');
        }
        else 
        {
          return res.render('./login' , {note : "incorrect password"});
        } 
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.signup = (req , res , next) => {
  return res.render('./signup');
};

exports.userCreation = (req , res , next) =>{
  console.log(req.body.gmail);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    gmail: req.body.gmail,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone
  });
  console.log(user);
    user.save()
    .then(result => {
      console.log(result);
      return res.render('./login', {note : "signup successful"});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.logout = (req , res , next) =>{
  console.log('in logout')
  res.clearCookie('token');
  return res.render('./login', {note : "successfully logged out"});
};

exports.dashboard = (req , res , next) =>{
  console.log('in dash board');
  Product.find({seller : req.userData.gmail})
  .exec()
      .then(products => {
        return res.render('./dashboard',{name : req.signedCookies.name , products : products});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};