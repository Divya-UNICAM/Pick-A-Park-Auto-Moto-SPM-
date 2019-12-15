const router = require('express').Router();
const dotenv = require('dotenv');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const paypal = require('paypal-rest-sdk');
dotenv.config();

router.get('/', async (req,res) => {

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
                    "price": "20.00",
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": "20.00"
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
                    res.status(301).redirect(payment.links[i].href);
                }
            }
        }
    });
});

router.get('/success', (req,res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transaction": [{
            "amount": {
                "currency": "USD",
                "total": "20.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if(error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get payment Response");
            console.log(JSON.stringify(payment));
            res.send("payment Success");
        }
    })
});

router.get('/cancel', (req,res) => {
    res.send("Payment cancelled");
});

module.exports = router;