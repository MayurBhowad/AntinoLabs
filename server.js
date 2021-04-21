const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//Import Routes
const products = require('./routes/api/product');
const users = require('./routes/api/users');
const admins = require('./routes/api/admins');

const app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//DB Config
const db = require('./config/keys').MongoURI;

//Connect ot mongoDB
mongoose
    .connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('Mongo Db connected'))
    .catch(err => console.log(err));

// Passport MiddleWare
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//Use Routes
app.use('/api/products', products);
app.use('/api/admins', admins);
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on port: ${port}`));