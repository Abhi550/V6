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
          var token = jwt.sign({ gmail : user[0].gmail, name: user[0].name , phone: user[0].phone }, "secret3256");
            res.cookie('token', token, cookieConfig);
            res.cookie('name', user[0].name, cookieConfig );
            return res.status(200).redirect('/home');
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
  Product.find()
  .select({ _id: 1, productName: 1, description: 1, type : 1, seller : 1, quantity : 1, price : 1, imagepath : 1, buyers : 1})
  .exec()
      .then(products => {
        return res.render('./dashboard',{name : req.signedCookies.name, phone : req.userData.phone , products : products , gmail : req.userData.gmail});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};


exports.cart = (req , res, next) => {
  console.log("In Cart");
  User.findOne({gmail : req.userData.gmail})
  .select({cart : 1})
  .exec()
  .then(cart => {
    console.log(cart);
    return res.render('./cart',{ name : req.signedCookies.name , products : cart.cart, sum : 0, note : "no"});
  })
  .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.history = (req, res, next) =>{
  User.findOne({gmail : req.userData.gmail})
  .select({history : 1})
  .exec()
  .then(history => {
    return res.render('./history',{ name : req.signedCookies.name , products : history.history});
  })
  .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};


exports.notification = (req, res, next) =>{
  User.findOne({gmail : req.userData.gmail})
  .select({notification : 1})
  .exec()
  .then(notification => {
    return res.render('./notification',{ name : req.signedCookies.name , products : notification.notification});
  })
  .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};