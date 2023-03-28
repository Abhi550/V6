const express = require('express');
const router = express.Router();

const userControllers = require('./controllers/user');
const productControllers = require('./controllers/product');
const checkAuthMiddleware = require('./middleware/checkAuthMiddleware');

//routes

router.get('/login', userControllers.logIn );
router.get('/signup', userControllers.signup );


router.post('/signin' , userControllers.signin);

router.post('/userCreation' , userControllers.userCreation);

router.get('/logout' , checkAuthMiddleware , userControllers.logout);

router.get('/dashboard' , checkAuthMiddleware , userControllers.dashboard);

//cart to view cart
router.get('/cart', checkAuthMiddleware, userControllers.cart);


//buy and sell

router.post('/addToCart', checkAuthMiddleware , productControllers.addToCart);
router.post('/buy', checkAuthMiddleware , productControllers.buy);

router.post('/addProduct', checkAuthMiddleware , productControllers.addProduct);
router.get('/sell', checkAuthMiddleware , productControllers.sell);


router.post('/updateProduct', checkAuthMiddleware , productControllers.updateProduct);
router.post('/removeProduct', checkAuthMiddleware , productControllers.removeProduct);

module.exports = router;