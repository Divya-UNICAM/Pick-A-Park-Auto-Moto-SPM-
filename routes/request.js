const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const payment = require('./payment');

router.post('/', async (req,res) => {
    console.log(req.body);
    //Validate the req. data before creating a request
    //const { error } = requestValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);

    //Create a new request
    const parkingRequest = new Request({
        startingLocation : req.body.startingLocation,
        targetLocation : req.body.targetLocation,
        date : req.body.date,
        duration : req.body.duration,
        licensePlate: req.body.licensePlate,
        status: 'Awaiting payment'
    });
    try{
        const savedRequest = await parkingRequest.save();
        return request.get(url.resolve('http://localhost:'+process.env.PORT,'api/pay'))
            .then((body) => res.send(body))
            .catch((err) => res.status(400).send(err))
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
