const express = require('express');
const router = express.Router();

const userControllers = require('./controllers/user');
const productControllers = require('./controllers/product');
const checkAuthMiddleware = require('./middleware/checkAuthMiddleware');
const imageUpload = require('./middleware/imageUpload');
const checkcart = require('./middleware/checkcart');
//routes

router.get('/login', userControllers.logIn );
router.get('/signup', userControllers.signup );


router.post('/signin' , userControllers.signin);

router.post('/userCreation' , userControllers.userCreation);

router.get('/logout' , checkAuthMiddleware , userControllers.logout);

router.get('/dashboard' , checkAuthMiddleware , userControllers.dashboard);

//history
router.get('/history' , checkAuthMiddleware , userControllers.history);



//cart to view cart
router.get('/cart', checkAuthMiddleware, checkcart, userControllers.cart);


router.post('/updateCart', checkAuthMiddleware , productControllers.updateCart);

//buy and sell
router.get('/home', checkAuthMiddleware , productControllers.items);



router.post('/searchByCat', checkAuthMiddleware , productControllers.searchByCat);
router.post('/addToCart', checkAuthMiddleware , productControllers.addToCart);


router.post('/buy', checkAuthMiddleware , productControllers.buy);

router.post('/addProduct', checkAuthMiddleware , productControllers.addProduct);
router.get('/sell', checkAuthMiddleware , productControllers.sell);


router.post('/updateProduct', checkAuthMiddleware , productControllers.updateProduct);
router.post('/removeProduct', checkAuthMiddleware , productControllers.removeProduct);

router.post('/request', checkAuthMiddleware , productControllers.requestSeller);

router.post('/acceptRequest', checkAuthMiddleware , productControllers.acceptRequest);

router.get('/notification', checkAuthMiddleware, checkcart , userControllers.notification);

module.exports = router;