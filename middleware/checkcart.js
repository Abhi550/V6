const User = require('../models/user');
const Product = require('../models/products');
const user = require('../models/user');
module.exports = (req, res, next) => {
    try {
        Product.find({quantity : 0})
        .select({_id : 1 , productName :1})
        .exec()
        .then(products => {
            var i=0;
            for(i=0;i<products.length;i++){
                const notification = {
                    productName : products[i].productName,
                    cat: "soldout",
                    date : Date.now()
                }
                User.updateMany({'cart.productId': products[i]._id.toString()}, {$pull : {cart : { productId : products[i]._id.toString()}}, $push :  {notification : notification}})
                .exec()
                .then()
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                    error: err
                   });
                });
            }
            next();

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
           });
        });

    } catch (error) {
        return res.status(401).render('./login',{note :"login to access the page"});
    }
}