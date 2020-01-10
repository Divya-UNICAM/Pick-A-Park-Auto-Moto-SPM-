process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const server = require('../../../server');

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

describe('POST /api/pay', () => {
    before((done) => {
        db.connect()
        .then(() => done())
        .catch((err) => done(err));
    })
    
    it('OK, sending a payment request works', (done) => {
        request(server).get('/api/pay')
            .then((res) => {
                expect(res).to.have.property('status',200);
                done();
            })
            .catch((err) => done(err));
    })
})

