const router = require('express').Router();
const querystring = require('querystring');
const dotenv = require('dotenv');
const Request = require('../db/models/Request');
const Transaction = require('../db/models/Transaction');
const Cost = require('../db/models/Cost');
const { requestValidation } = require('../validation');
const paypal = require('paypal-rest-sdk');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const dbUtils = require('../utils/dbUtils');
const { decrypt, encrypt } = require('../utils/salt');
const { getDirections } = require('../utils/directions');

dotenv.config();

const client = new checkoutNodeJssdk.core.PayPalHttpClient(
    new checkoutNodeJssdk.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID
    )
);

router.post('/', async (req,res) => {
    if(!req.cookies["reqId"])
        return res.sendStatus(403);
    const reqId = req.cookies["reqId"];
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    let priceToPay;
    const requestedRequest = await Request.findById(reqId);
    priceToPay = Math.floor((requestedRequest.assignedplace.distance * requestedRequest.assignedplace.price)/10);
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        redirect_urls: {
            return_url: "http://localhost:"+process.env.PORT+"/api/pay/success?id="+reqId,
            cancel_url: "http://localhost:"+process.env.PORT+"/api/pay/cancel?id="+reqId
        },
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: priceToPay.toString()
            }
        }]
    });
    let order;
    try {
        order = await client.execute(request);
    } catch (err) {

        // 4. Handle any errors from the call
        return res.status(500).send(err);
    }
    // 5. Validate the transaction details are as expected
    if (order.result.status !== 'CREATED') {
        return res.sendStatus(400);
    }

    // 6. Save the transaction in your database
    const transaction = await new Transaction(order.result).save();
    //console.log(order)
    await requestedRequest.updateOne({
        status: order.result.id
    });
    await requestedRequest.save();

    // 7. Return a successful response to the client
    return res.status(200).json({
        orderID: order.result.id
    });
});

//After confirming the payment method in paypal, payment will apply
router.get('/success', (req,res) => {
    const reqId = req.cookies['reqId'];
            
    //payment successful so post the request data to the route service
    //for creating the map with directions
    //I have to update the payment id with a non empty payment id
    Request.findById(reqId, (err, doc) => {
        if(err)
            return res.status(500).send(err);
        coordinates = {
            startingLat: doc.startingLocation.lat,
            startingLng: doc.startingLocation.lng,
            targetLat: doc.assignedplace.place.lat,
            targetLng: doc.assignedplace.place.lng
        };
        //Get the nearest parking place for the specified destination
        

        //Return map with directions
        const query = querystring.stringify(coordinates);
        res.cookie("reqId",reqId).redirect('http://localhost:3001/route?'+query);
        //Redirect to a successful checkout page and send invoice
    });
});

router.get('/cancel', (req,res) => {
    res.send("Payment cancelled");
});

module.exports = router;