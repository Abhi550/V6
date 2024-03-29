var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer');
var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
module.exports = (req, res, next) => {
    return multer({ storage: storage });
}