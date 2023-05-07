const mongoose = require("mongoose");
const User = require('../models/user');
const Product = require('../models/products');
const products = require("../models/products");
const { cart } = require("./user");
const path = require("path");

//var cloudinary = require('cloudinary').v2;


exports.items = (req, res, next) =>{
   Product.find()
    .select({ _id: 1, productName: 1,description : 1, type : 1, seller : 1, quantity : 1, price : 1, imagepath : 1})
    .exec()
    .then(products => {
        return res.render('./items',{name : req.signedCookies.name , products : products , gmail : req.userData.gmail, note: "all"});
      })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};




//searchByCat
exports.searchByCat = (req, res, next) =>{
  if(req.body.type == "all")
  {
    Product.find()
    .select({ _id: 1, productName: 1,description : 1, type : 1, seller : 1, quantity : 1, price : 1, imagepath :1})
    .exec()
    .then(products => {
        return res.render('./items',{name : req.signedCookies.name , products : products , gmail : req.userData.gmail, note: "all"});
      })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
  else{
  Product.find({ type : req.body.type })
  .select({ _id: 1, productName: 1,description : 1, type : 1, seller : 1, quantity : 1, price : 1, imagepath :1})
  .exec()
  .then(products => {
    return res.render('./items',{name : req.signedCookies.name , products : products , gmail : req.userData.gmail, note : req.body.type});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}
};





exports.addToCart = (req , res , next) =>{
  console.log("adding to cart");
  const cartItem = {
    imagepath : req.body.imagepath,
    productId : req.body.id,
    productName : req.body.productName,
    description : req.body.description,
    quantity : req.body.quantity,
    price : req.body.price,
    seller : req.body.seller
  };
  User.updateOne({gmail : req.userData.gmail},{$push :  {cart : cartItem}})
  .exec()
  .then(output => {
      return res.redirect('/cart');
      })
  .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.updateCart = (req , res, next) => {
  if(req.body.operation == "remove")
  {
    User.updateOne({gmail : req.userData.gmail},{$pull : {cart : { productId : req.body.id }}})
    .exec()
    .then(output => {
      return res.redirect('/cart');
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }
  //updating quantity
  else
  {

  }
};

exports.buy = (req , res , next) =>{
  
  User.find({gmail : req.userData.gmail})
  .select({cart : 1})
  .exec()
  .then(output => {
    const cart= output[0].cart;
    for(let i=0;i<cart.length;i++)
    {
      const dec = -(cart[i].quantity);
      Product.updateOne({_id : cart[i].productId},{$inc : {quantity : dec}, $push :  {buyers : req.userData.gmail}})
      .exec()
      .then(data=>{
        const history = {
          imagepath : cart[i].imagepath,
          productId : cart[i].productId,
        productName : cart[i].productName,
        description : cart[i].description,
        quantity : cart[i].quantity,
        price : cart[i].price,
        seller : cart[i].seller,
        total : cart[i].quantity * cart[i].price ,
        date : Date.now()
        };
        User.updateOne({gmail : req.userData.gmail},{$push :  {history : history}})
       .exec()
       .then(data => {
             User.updateOne({gmail : req.userData.gmail},{$pull : {cart : { productId : cart[i].productId}}})
              .exec()
              .then(data2 => {
                       const notification = {
                        cat: "request",
                        name: req.signedCookies.name,
                        gmail : req.userData.gmail,
                        productName : cart[i].productName,
                        description : cart[i].description,
                        quantity : cart[i].quantity,
                        total : cart[i].quantity * cart[i].price,
                        date : Date.now()
                      }
                      User.updateOne({gmail : cart[i].seller}, {$push : {notification : notification}})
                      .exec()
                      .then(data3 => {
                        console.log("notified");
                      })
                      .catch(err => {
                        console.log(err);
                         res.status(500).json({
                          error: err
                       });
                        });
              })
              .catch(err => {
                console.log(err);
                 res.status(500).json({
                  error: err
               });
                });
       })
        .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
          });
        });
    }
    res.redirect('/history');

  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};


exports.addProduct = (req , res , next) =>{
  console.log(req);
  // Get the file that was set to our field named "image"
  //const { image } = req.files;
  const productimage = req.files.productimage;
  console.log(req.files.productimage);
  var productimageName = req.body.productName +"_"+ Date.now().toString()+".jpeg";
  productimageName = productimageName.replace(/\s+/g,"_");

  const imagepath = 'E:\\CSU\\campus connect\\public\\upload\\' + productimageName;
  productimage.mv(imagepath);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        description: req.body.description,
        type : req.body.type,
        seller : req.userData.gmail,
        quantity : req.body.quantity,
        price : req.body.price,
        imagepath : productimageName
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


//upadte the request to seller notification
exports.requestSeller =(req, res, next) => {
  Product.findOne({_id : req.body.id})
  .exec()
  .then(product => {
    const notification = {
      productName : product.productName,
      productId : product._id,
      reqUser : req.userData.gmail,
      reqPrice : req.body.reqPrice,
      message : req.body.message,
      reqStatus : "new",
      reqId : new mongoose.mongo.ObjectId(),
      cat : "change",
      iam : "seller"

    }
    User.updateOne({gmail : product.seller}, {$push :  {notification : notification}})
    .exec()
    .then(data => {
      res.redirect('/notification');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};


//update the price if accepted and sent the notification
exports.acceptRequest = (req, res, next) => {
  if(req.body.reqStatus == "accepted"){
    User.updateOne({gmail : req.userData.gmail, "notification.reqId" : req.body.reqId},{$set : {"notification.$.reqStatus": "approved"}},)
    .exec()
    .then(data => {
      User.updateOne({gmail : req.body.reqUser, "cart.productId" : req.body.productId},{$set : {"cart.$.price" : req.body.reqPrice}})
      .exec()
      .then(data2 => {
        console.log("inside accc iner loop");
        const noti = {
          cat : "change",
          productId: req.body.productId,
          productName: req.body.productName,
          reqStatus : "approved",
          reqId : req.body.productId,
          reqPrice : req.body.reqPrice,
          iam : "buyer"
        }
        User.updateOne({gmail : req.body.reqUser},{$push :  {notification : noti}})
        .exec()
        .then(data3 => {
          res.redirect('/notification');
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }



  else if(req.body.reqStatus == "rejected"){
    User.updateOne({gmail : req.userData.gmail,"notification.reqId" : req.body.reqId},{"notification.$.reqStatus": "rejected"})
    .exec()
    .then(data => {
      const noti = {
        cat : "change",
        productId: req.body.productId,
        productName: req.body.productName,
        reqStatus : "rejected",
        reqId : req.body.productId,
        reqPrice : req.body.reqPrice,
        iam : "buyer"
      }
      User.updateOne({gmail : req.body.reqUser},{$push :  {notification : noti}})
      .exec()
      .then(data2 => {
        res.redirect('/notification');
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }

};