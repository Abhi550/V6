const mongoose = require("mongoose");
const User = require('../models/user');
const Product = require('../models/products');



exports.addProduct = (req , res , next) =>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        type : req.body.type,
        seller : req.userData.gmail,
        quantity : req.body.quantity,
        price : req.body.price
    });
    product.save()
    .then(result => {
      console.log(result);
      return res.render('./sell', {note : "product  added  successful", name : req.signedCookies.name});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.sell = (req , res , next) => {
    return res.render('./sell',{name : req.signedCookies.name , note: "no"});
};

exports.updateProduct = (req , res , next) => {
    console.log("in updatee");
    console.log(req.body.id);
    Product.updateOne({_id : req.body.id},{price : req.body.price , quantity : req.body.quantity})
    .exec()
    .then(output => {
        return res.redirect('/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
};

exports.removeProduct = (req , res , next) => {
    console.log("in remove");
    console.log(req.body.id);
    Product.updateOne({_id : req.body.id},{quantity : 0})
    .exec()
    .then(output => {
        return res.redirect('/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};