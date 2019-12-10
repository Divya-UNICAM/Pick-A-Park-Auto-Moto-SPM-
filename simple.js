const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var port = process.env.PORT || 3001
app.use(bodyParser.json());

app.route('/')
    .get((req,res) => {
        res.send('Hello');
    })

app.listen(port, () => {
    console.log('Server started!');
})

module.exports = app;