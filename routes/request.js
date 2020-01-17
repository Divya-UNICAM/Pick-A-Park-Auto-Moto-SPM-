const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const bcrypt = require('bcryptjs');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const payment = require('./payment');
const { geolocate, geolocatev2, geolocatev3 } = require('../utils/geolocator');
const { extractIp } = require('../utils/extract-ip');
const hasher = require('../utils/salt');
const faker = require('faker');

router.post('/', async (req,res) => {
    console.log(req.body);
    //Validate the req. data before creating a request
    const { error } = requestValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    
    //Create a new request
    const parkingRequest = new Request({
        startingLocation : req.body.startingLocation,
        targetLocation : req.body.targetLocation,
        date : req.body.date,
        duration : req.body.duration,
        licensePlate: req.body.licensePlate,
        status: ""
    });
    try{
        const savedRequest = await parkingRequest.save();
        //Process the payment
        console.log(savedRequest);
        return request.get(url.resolve('http://localhost:'+process.env.PORT,'/api/pay?id='+savedRequest.id))
            .then((link) => { 
                res.send(link);
            }) //Return the link to the confirmation payment page becusae using redirect gives error cors
            .catch((err) => { return res.status(500).send(err) })
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;
