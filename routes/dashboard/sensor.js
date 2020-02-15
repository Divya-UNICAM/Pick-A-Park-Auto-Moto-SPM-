const router = require('express').Router();
const request = require('request-promise');
const Request = require('../../db/models/Request');
const Sensor = require('../../db/models/Sensor');
const ParkingPlace = require('../../db/models/ParkingPlace');
const PoliceOfficer = require('../../db/models/PoliceOfficer');
const Job = require('../../db/models/Job');
const Municipality = require('../../db/models/Municipality');
const User = require('../../db/models/User');
const Cost = require('../../db/models/Cost');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jobValidation,policeOfficerValidation, sensorValidation, municipalityValidation, parkingPlaceValidation } = require('../../validation');
const { reverseGeolocatev1 } = require('../../utils/geolocator');

//adding a new sensor to a parking place
router.post('/:postcode/:address', async (req,res) => {
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');

	const { error } = sensorValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.send(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: munId, 
			'location.address': parkAddress
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const addedSensor = await new Sensor({
			parkingplace: requestedParkingPlace.id,
			position: req.body.position,
			ipAddress: req.body.ipAddress
		}).save();
		
		console.log('Sensor added');
		//Create and assign a token for the sensor in order to make it able to send updates
		const token = jwt.sign({id: addedSensor.id},process.env.TOKEN_SECRET);
		console.log(token);
		res.cookie('sensor_token',token,{
			expires:false, httpOnly: true
		}).send(addedSensor);
    } catch (err) {
        res.status(500).send(err);
    }
});

//retrieve a sensor from the specfied parking place
router.get('/:postcode/:address/:position',async (req,res) => {
	const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	const sensId = req.params.position;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        Municipality.findById(munId, (err,doc) => {
            if(err)
                return res.status(400).send(err);
            for(let i = 0; i < doc.sensors.length;i++) {
                if(doc.sensors[i]._id === sensId) {
                    return res.send(doc.sensors[i]);
                }
            }
        })
    } catch (err) {
        res.status(500).send(err);
    }
});

//retrieve all sensors from the specified parking place in the specified municipality
router.get('/:postcode/:address', async (req,res) => {
    const munId = req.params.postcode;
	const address = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munId});
        if(!requestedMunicipality)
            return res.status(404).send('Municipality not found');
        const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality.id,
            "location.address": address
		});
        if(!requestedParkingPlace)
            return res.status(404).send('No parking place found in this address');
        const requestedSensors = await Sensor.find({
            parkingplace : requestedParkingPlace.id
        });
        if(!requestedSensors)
            return res.status(404).send('Parking place has no sensors installed');
        res.send(requestedSensors);
    } catch (err) {
        res.status(500).send(err);
    }
});

//update an existing sensor in the specified municipality
router.put('/:postcode/:address/:position', async (req,res) => {
	const { error } = sensorValidation(req.body);
	if(error) return res.send(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	const sensorId = req.params.position;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality._id,
			'location.address': parkAddress
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		let requestedSensor = await Sensor.findOne(
			{	
				position: sensorId, 
				parkingPlace: requestedParkingPlace.id
			});
		if(!requestedSensor)
			return res.status(404).send('Sensor not found in specified position');
        res.send(await requestedSensor.set(req.body).save());
    } catch (err) {
        res.status(500).send(err);
    }
});

//delete an existing sensor in the municipality
router.delete('/:postcode/:address/:position', async (req,res) => {
	const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	const sensorId = req.params.position;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality._id,
			'location.address': parkAddress
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const requestedSensor = await Sensor.deleteOne(
			{
				position: sensorId, 
				parkingPlace: requestedParkingPlace._id
			})
			.then((result) => res.send(result))
			.catch((err) => res.status(500).send(err));
		console.log('Sensor deleted');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;