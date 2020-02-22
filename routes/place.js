const router = require('express').Router();
const Request = require('../db/models/Request');
const Municipality = require('../db/models/Municipality');
const ParkingPlace = require('../db/models/ParkingPlace');
const dbUtils = require('../utils/dbUtils');
const querystring = require('querystring');

const deg2rad = (deg) => {
    return deg * (Math.PI/180);
};

const rad2deg = (rad) => {
    return rad * (180/Math.PI);
};

router.get('/autocomplete/:output', async (req,res) => {
    let places = [];
    const output = req.params.output;
    const input = req.query.term.toLowerCase();
    if(output !== 'json')
        return res.status(400).send('Malformed request');
    
    const possibleMunicipalities = await Municipality.find({
       name: { $regex: input, $options: 'i' } 
    }, (err, doc) => {
        try {
            if(err)
                throw err;
            if(doc.length <= 0)
                return;
            doc.forEach((val,index,array) => {
                let ret = {
                    label: val.name,
                    value: val.location
                }
                places.push(ret);
            })
            
        } catch (err) {
            console.log(err);
        }
    });
    const possibleParkingPlaces = await ParkingPlace.find({
        'location.address': { $regex: input, $options: 'i' }
    }, (err, doc) => {
        try {
            if(err)
                throw err;
            if(doc.length <= 0)
                return;
            doc.forEach((val,index,array) => {
                let ret = {
                    label: val.name,
                    value: val.location.address
                }
                places.push(ret);
            })
            
        } catch (err) {
            console.log(err);
        }
    });
    //Value is what you put in the text input, label is what you see in the dropdown
    //If there is only one item, value and label are used the same way
    //If you specify only value, value will be used both as label and value
    if(places.length <= 0) {
        ret = {
            label: "Unavailable municipality",
            value: ""
        };
        res.send(ret);
    }
    else {
        
        res.send(places);
    }
});

router.get('/distance', async (req,res) => {
    const stLat = req.query.stLat;
    const stLng = req.query.stLng;
    const tgLat = req.query.tgLat;
    const tgLng = req.query.tgLng;
    const theta = stLng - tgLng;
    let distance = Math.sin(deg2rad(stLat)) * Math.sin(deg2rad(tgLat))
        + Math.cos(deg2rad(stLat)) * Math.cos(deg2rad(tgLat)) * Math.cos(theta);
    distance = Math.acos(distance);
    distance = rad2deg(distance);
    distance = distance * 60 * 1.1515 * 1.609344;
    res.send(distance);
});

//receive current position from drivers
//this service is called every defined time step by the driver route page
router.post('/tracking', async (req,res) => {
    const reqId = req.cookies['reqId'];
    const currentPosition = {
        lat: req.body.lat,
        lng: req.body.lng
    }
    const requestedRequest = await Request.findById(reqId);
    if(!requestedRequest)
        res.status(404).send('Request not found');
    const assignedPlace = requestedRequest.assignedplace;
    let places = await dbUtils.getDistanceBetween(currentPosition);
    const elementMinCurrentDistance = places.reduce((prev,curr) => {
        return prev.distance < curr.distance ? prev : curr;
    });
    //console.log(assignedPlace)
    //console.log(elementMinCurrentDistance)
    //if there is a new parking place, either freed or newly added, with a better position
    //with respect to the destination, choose it and re-route
    if(elementMinCurrentDistance.place !== assignedPlace.place && elementMinCurrentDistance.distance < assignedPlace.distance) {
        await requestedRequest.updateOne({
            assignedplace: elementMinCurrentDistance
        });

        coordinates = {
            startingLat: requestedRequest.startingLocation.lat,
            startingLng: requestedRequest.startingLocation.lng,
            targetLat: elementMinCurrentDistance.place.lat,
            targetLng: elementMinCurrentDistance.place.lng
        };
        //Get the nearest parking place for the specified destination

        //Return map with directions
        const query = querystring.stringify(coordinates);
        return res.cookie("reqId",reqId).redirect('http://localhost:3001/route?'+query);
        //Redirect to a successful checkout page and send invoice
    } else
        //send Not Modified if the parking place doesn't need to be changed
        return res.sendStatus(304);
});

module.exports = router;