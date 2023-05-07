const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("auth entered")
        const token = req.signedCookies.token;
        const decoded = jwt.verify(token, "secret3256");
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).render('./login',{note :"login to access the page"});
       // return res.status(401).json({
         //   message: 'Auth failed'
        //});
    }
}