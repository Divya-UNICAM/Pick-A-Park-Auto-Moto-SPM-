process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const dbUtils = require('../../../utils/dbUtils');
const db = require('../../../db/index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts)
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

describe('GET /route', () => {
    var sentRequestId;
    before((done) => {
        dbUtils.addARequestTest(
            "Camerino",
            "Camerano",
            "12-12-19",
            "1111111",
            10
        ).then((req) => {
            sentRequestId = req._id;
            done();
        }).catch((err) => done(err));
    });

    it('OK, getting route to destination works', (done) => {
        var options = {
            method: "GET",
            uri: "http://localhost:3001/api/pay/success",
            resolveWithFullResponse: true,
            headers: {
                'Cookie': 'reqId='+sentRequestId
            }
        }
        request(options) //force payment success
            .then((res) => {
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch((err) => done(err));
    })
})

