const router = require('express').Router();
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');

router.post('/', async (req,res) => {
    //Validate the req. data before creating a request
    const { error } = requestValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create a new request
    const request = new Request({
        startingLocation : req.body.startingLocation,
        targetLocation : req.body.targetLocation,
        duration : req.body.duration,
        licensePlate: req.body.licensePlate,
        status: 'Awaiting payment'
    });
    try{
        const savedRequest = await request.save();
        res.send(request);
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;