//After payment confirmation display route in a map
//So i need to take the starting location and target location geocodes
//And create a page with a map showing the route from point A to point B

//Here i assume that payment has been confirmed
const router = require('express').Router();
const request = require('request-promise');
const Request = require('../db/models/Request');
const hasher = require('../utils/salt');
const dir = require('../utils/directions');

//Call to the /api/route
router.get('/', async (req, res) => {
    let payment_cookie = req.cookies[0]; //I get the payment cookie
    //I need to call directions api
    let paidRequest = await Request.findById(payment_cookie)
        .then((doc) => {
            return JSON.parse(doc);
        })
        .catch((err) => {
            return err;
        })
    let data = {
        coordinates: [
            [   //Starting location
                hasher.decrypt(paidRequest.startingLocation.latitude),
                hasher.decrypt(paidRequest.startingLocation.longitude)
            ],
            [   //Target location
                hasher.decrypt(paidRequest.targetLocation.latitude),
                hasher.decrypt(paidRequest.targetLocation.longitude)
            ]
        ]
    }
    dir.getDirections(coordinates)
        .then((body) => {
            res.send(body);
        })
        .catch((err) => console.log(err));
});

module.exports = router;