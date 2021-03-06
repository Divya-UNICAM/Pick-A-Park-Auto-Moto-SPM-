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

//retrieve all parking places in the system and display their status
router.get('/parkingplaces/:postcode', async (req,res) => {
	const munPostcode = req.params.postcode;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
	try {
		const mun = await Municipality.findOne({postcode: munPostcode});
		if(!mun)
			return res.status(404).send('Municipality not found');
		const munId = mun._id;
		const requestedParkingPlaces = await ParkingPlace.find({municipality: munId});
		if(requestedParkingPlaces.length <= 0)
			return res.status(404).send('No parking places found in specified municipality');
		console.log('Retrieved all parking places');
		res.send(requestedParkingPlaces);
	} catch (err) {
		return res.status(500).send(err);
	}
});

//retrieve a single parking place from the specified municipality in the specified address
router.get('/parkingplaces/:postcode/:address', async (req,res) => {
	//Client side must validate the address with google maps Places API
	const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        const requestedParkingPlace = await ParkingPlace.findOne({
            municipality: munId,
            'location.address': parkAddress
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		res.send(requestedParkingPlace);
    } catch (error) {
        res.status(400).send(error);
    }
});

//add a new parking place in the system
// name is the municipality name
router.post('/parkingplaces/:postcode', async (req,res) => {
    const { error } = parkingPlaceValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
        const addedAParkingPlace = await new ParkingPlace({
			municipality: requestedMunicipality.id,
			//lat and lng are defined by the client issuing the request
			//given that you must issue the address of the pkplace
			//the client (browser) will also call the geolocation service
            location: {
				lat: req.body.location.lat,
				lng: req.body.location.lng,
				address: req.body.location.address.toLowerCase()
			}
        }).save();
        console.log('Added a new parking place');
        res.send(addedAParkingPlace);

    }catch(err) {
        res.status(500).send(err);
    }
});

//Update and exisisting parking place
router.put('/parkingplaces/:postcode/:address', async (req,res) => {
	const { error } = parkingPlaceValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	//each address used in these services comes from the Google Maps Places API
	//so each address is "true and verified", at least it will encoded to escape special characters in URL
	//when issueing the request, the address will be put in URL as is, just escaped characters
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        let parkPlace = await ParkingPlace.findOne({
			municipality: munId,
			'location.address': parkAddress
		});
		if(!parkPlace)
			return res.status(404).send('Parking place not found');
        const updated = await parkPlace.set(req.body).save();
		console.log('Parking place updated');
		res.send(updated);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//Delete an existing parking place
router.delete('/parkingplaces/:postcode/:address', async (req,res) => {
    const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        const deletedParkPlace = await ParkingPlace.deleteOne({
			municipality: munId,
			'location.address': parkAddress
		})
			.then((result) => res.send(result))
			.catch((err) => res.status(500).send(err));
		console.log('Parking place deleted');
    } catch (err) {
        return res.status(500).send(err);
    }
});