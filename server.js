const express = require('express');
const app = express();
const db = require('./db/index.js');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const paypal = require('paypal-rest-sdk');

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const requestRoute = require('./routes/request');
const paymentRoute = require('./routes/payment');

dotenv.config();
paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET_ID});

var port = process.env.PORT || 3001
process.env.PORT = port

//Init EJS
app.set('view engine', 'ejs');

//Connect to DB
db.connect().then(() => console.log('Connected to DB!'));

//Use Middlewares
app.use(bodyParser.json()); //Body-parser
app.use(cors());

//Route Middlewares - where the user will navigate
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);
app.use('/api/request', requestRoute);
app.use('/api/pay',paymentRoute);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/home/index.html'));
});

app.listen(port, () => {
    console.log('Server Up and running!');
});

module.exports = app;