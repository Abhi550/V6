const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gmail : String,
    password : String,
    name : String,
    phone : Number,
    cart : [{productId : String,
        imagepath : String, 
        productName : String,
        description : String,
    quantity : Number,
    price : Number,
    seller : String,
    total : Number}],
    history : [{productId : String,
        imagepath: String,
        productName : String,
        description : String,
        quantity : Number,
        price : Number,
        seller : String,
        total : Number,
        date : Date}],
    notification : [{
        name: String,
        gmail : String,
        productName : String,
        description : String,
        quantity : Number,
        total : Number,
        date : Date,
        seller: String,
        imagepath: String,
        productId:  String,
        message : String,
        reqPrice : Number,
        cat: String,  //soldout //request  //change
        reqStatus : String  //new //rejected //approved
    }]

});

module.exports = mongoose.model('User', userSchema);