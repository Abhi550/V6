const mongoose = require('mongoose');
const { stringify } = require('querystring');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: String,
    description : String,
    imagepath: String,
    type : String,
    seller : String,
    quantity : Number,
    buyers : [String],
    price : Number

});

module.exports = mongoose.model('Product', productSchema);