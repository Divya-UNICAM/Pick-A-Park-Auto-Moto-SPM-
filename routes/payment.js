const router = require('express').Router();
const querystring = require('querystring');
const dotenv = require('dotenv');
const Request = require('../db/models/Request');
const Cost = require('../db/models/Cost');
const { requestValidation } = require('../validation');
const paypal = require('paypal-rest-sdk');
const request = require('request-promise');
const { decrypt, encrypt } = require('../utils/salt');
const { getDirections } = require('../utils/directions');

dotenv.config();

router.get('/', async (req,res) => {
    console.log(req.cookies);
    const cost = Cost.findOne();
    price = Request.findById(id, (err, doc) => {
        price = price * doc.duration;
    });
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:"+process.env.PORT+"/api/pay/success",
            "cancel_url": "http://localhost:"+process.env.PORT+"/api/pay/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "parking place",
                    "sku": "001",
                    "price": price,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": price
            },
            "description": "your receipt of the booking of the parking."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url') {
                    res.send(payment.links[i].href);
                }
            }
        }
    });
});

//After confirming the payment method in paypal, payment will apply
router.get('/success', (req,res) => {
    console.log(req.query)
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": price
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if(error) {
            //console.log(error.response);
            console.log(error.response)
            
        } else {
            console.log('payment success');
            //payment successful so post the request data to the route service
            //for creating the map with directions
            //I have to update the payment id with a non empty payment id
            Request.findOneAndUpdate({_id: id}, {
                status: id //Set a payment id to show payment done
            },{new: true}, (err, doc) => {
                if(err)
                    res.status(400).send(err);
                coordinates = 
                        [
                            decrypt(doc.startingLocation.lat),
                            decrypt(doc.startingLocation.lng)
                        ],
                        [
                            decrypt(doc.targetLocation.lat),
                            decrypt(doc.targetLocation.lng)
                        ]
                ;
                console.log(coordinates)
                //Send the post to the directions api to retrieve the directions to the parking place
                let directions = null;
                getDirections(coordinates)
                    .then((res) => {
                        let routes = JSON.parse(res.body);
                        //directions is a JSON array with many sub arrays containing coordinates of each step
                        directions = routes.features.geometry.coordinates;
                        console.log(directions)
                    })
                    .catch((err) => console.log(err))

                //Return map with locations and from the js will ask directions
                const query = querystring.stringify({
                    "slat": coordinates[0][0],
                    "slng": coordinates[0][1],
                    "tlat": coordinates[1][0],
                    "tlng": coordinates[1][1]
                });
                res.redirect('http://localhost:3001/route?'+query);
                //Redirect to a successful checkout page and send invoice
            });
        }
    });
});

router.get('/cancel', (req,res) => {
    res.send("Payment cancelled");
});

module.exports = router;