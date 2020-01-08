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





//SERVICES FOR ADMINS AND TESTING PURPOSES

//Add a new municipality user to the platform
router.post('/municipality/admin', async (req,res) => {
	const body = req.body;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
        const addedAMunicipalityAdmin = await new User({
            name: body.name,
            email: body.email,
            password: body.password,
            privileges: 3
        }).save();
        res.send(addedAMunicipalityAdmin);
    } catch(err) {
        res.status(400).send(err);
    }
});

//Add a new parking company user to the platform
router.post('/parkingcompany/admin', async (req,res) => {
	const body = req.body;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
        const addedParkingCompanyAdmin = await new User({
            name: body.name,
            email: body.email,
            password: body.password,
            privileges: 4
        }).save();
        res.send(addedParkingCompanyAdmin);
    } catch(err) {
        res.status(400).send(err);
    }
});

router.put('/price', async (req,res) => {
	const toUpdate = req.body;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const currentCost = Cost.find();
        const updated = await currentCost.set(toUpdate).save();
        res.send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;