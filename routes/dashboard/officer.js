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

//retrieve all police officers working on the municipality
router.get('/officers/:postcode', async (req,res) => {
	const munPostcode = req.params.postcode;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
        const mun = await Municipality.findOne({postcode: munPostcode});
		if(!mun)
			return res.status(404).send('Municipality not found');
		const requestedPoliceOfficers = await PoliceOfficer.find({municipality: mun.id});
		if(requestedPoliceOfficers.length <= 0)
			return res.status(404).send('No police officers found in specified municipality');
		console.log('Retrieved all police officers');
		res.send(requestedPoliceOfficers);
        
    }catch(err) {
        return res.status(500).send(err);
    }
    
});

//retrieve a single police officer in the specified municipality
router.get('/officers/:postcode/:badge', async (req,res) => {
	const munPostcode = req.params.postcode;
	const officerId = req.params.badge;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
	try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedOfficer = await PoliceOfficer.findOne({
			municipality: requestedMunicipality._id,
			badge: officerId
		});
		if(!requestedOfficer)
			return res.status(404).send('Police officer not found');
		res.send(requestedOfficer);
	} catch (err) {
		res.status(500).send(err);
	}
});

//add a new police officer in the system
router.post('/officers/:postcode', async (req,res) => {
    const { error } = policeOfficerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		//Check if the user is already in the database
		const emailExists = await PoliceOfficer.findOne({email: req.body.email});
		if(emailExists) return res.status(400).send('Email already exists');
	
		//Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const addedPoliceOfficer = await new PoliceOfficer({
			municipality: requestedMunicipality._id,
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			badge: req.body.badge
        }).save();
        console.log('Added a new police officer');
        res.send(addedPoliceOfficer);

    }catch(err) {
        return res.status(500).send(err);
    }
});

//Update an exisiting police officer
router.put('/officers/:postcode/:badge', async (req,res) => {
	const { error } = policeOfficerValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	const officerId = req.params.badge;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		let requestedPoliceOfficer = await PoliceOfficer.findOne(
			{	
				badge: officerId, 
				municipality: requestedMunicipality.id
			});
		if(!requestedPoliceOfficer)
			return res.status(404).send('Police officer not found in specified municipality');
        res.send(await requestedPoliceOfficer.set(req.body).save());
    } catch (err) {
        res.status(500).send(err);
    }
});

//Delete an exisisting police officer
router.delete('/officers/:postcode/:badge', async (req,res) => {
	const munPostcode = req.params.postcode;
	const officerId = req.params.badge;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const deletedPoliceOfficer = await PoliceOfficer.deleteOne(
			{
				badge: officerId, 
				municipality: requestedMunicipality._id
			})
			.then((result) => res.send(result))
			.catch((err) => res.status(500).send(err));
		console.log('Police officer deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;