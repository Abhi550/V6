const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// connect to the MongoDB database
const username = "rohit321";
const password = "rohit321";
const cluster = "campusconnect";
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.kgftxvt.mongodb.net/?retryWrites=true&w=majority`
);



// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('modagudu'));


app.use('/',routes);

app.get('/', (req, res , next)=>{
  res.redirect('/index');
});


// start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
