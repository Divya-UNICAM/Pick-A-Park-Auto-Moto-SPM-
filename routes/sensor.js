const router = require('express').Router();
const Sensor = require('../db/models/Sensor');
const { sensorValidation } = require('../validation');

//Add a new sensor
router.post('/', async (req,res) => {
    //Validate the request data before creating a sensor
    const { error } = sensorValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Create a new sensor
    const sensor = new Sensor({
        location: req.body.location,
        date: req.body.date,
        status: 'FREE'
    });

    try{
        const savedSensor = await sensor.save();
        console.log('sensor saved')
        return res.send({id: savedSensor._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//Get all sensors
router.get('/', async (req,res) => {
    let sensors = await Sensor.find();
    res.send(sensors);
});

module.exports = router;