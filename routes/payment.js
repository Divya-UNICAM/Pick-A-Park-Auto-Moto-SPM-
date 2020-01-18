const router = require('express').Router();
const dotenv = require('dotenv');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const paypal = require('paypal-rest-sdk');
const request = require('request-promise');
const { decrypt } = require('../utils/salt');
const { getDirections } = require('../utils/directions');
const querystring = require('querystring');

dotenv.config();

router.get('/', async (req,res) => {
    const reqId = req.query.id;
    
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:"+process.env.PORT+"/api/pay/success?id="+reqId,
            "cancel_url": "http://localhost:"+process.env.PORT+"/api/pay/cancel?id="+reqId
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "parking place",
                    "sku": "001",
                    "price": "1.00",
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": "1.00"
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
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const reqId = req.query.id;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": "1.00"
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
            Request.findOneAndUpdate({_id: reqId}, {
                status: "PAID" //Set a payment id to show payment done
            },{new: true, useFindAndModify: false}, (err, doc) => {
                if(err)
                    return res.status(500).send(err);
                coordinates = {
                    startingLat: doc.startingLocation.lat,
                    startingLng: doc.startingLocation.lng,
                    targetLat: doc.targetLocation.lat,
                    targetLng: doc.targetLocation.lng
                };

                //Return map with directions
                const query = querystring.stringify(coordinates);
                res.redirect('http://localhost:3001/route?'+query);
                //Redirect to a successful checkout page and send invoice
            });
        }
    });
});

//TEST FOR FORCING PAYMENT
router.get('/test/success', (req,res) => {
    const reqId = req.query.id;
    //payment successful so post the request data to the route service
    //for creating the map with directions
    //I have to update the payment id with a non empty payment id
    Request.findOneAndUpdate({_id: reqId}, {
        status: "PAID" //Set a payment id to show payment done
    },{new: true, useFindAndModify: false}, (err, doc) => {
        if(err)
            return res.status(500).send(err);
        coordinates = {
            startingLat: doc.startingLocation.lat,
            startingLng: doc.startingLocation.lng,
            targetLat: doc.targetLocation.lat,
            targetLng: doc.targetLocation.lng
        };

        //Return map with directions
        const query = querystring.stringify(coordinates);
        res.redirect('http://localhost:3001/route?'+query);
        //Redirect to a successful checkout page and send invoice
    });
})

router.get('/cancel', (req,res) => {
    res.send("Payment cancelled");
});

module.exports = router;