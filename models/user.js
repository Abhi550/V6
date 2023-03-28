const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gmail : String,
    password : String,
    name : String,
    phone : Number

});

module.exports = mongoose.model('User', userSchema);