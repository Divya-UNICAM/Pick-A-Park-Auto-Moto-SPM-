const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const requestRoute = require('./routes/request');

dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.MONGO_URI,
    { 
        useNewUrlParser : true,
        useUnifiedTopology : true
    },
    () => console.log('Connected to DB!'))
;

//Use Middlewares
app.use(express.json()); //Body-parser
app.use(cors());

//Route Middlewares - where the user will navigate
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);
app.use('/api/request', requestRoute);

app.listen(3000, () => {
    console.log('Server Up and running!');
});