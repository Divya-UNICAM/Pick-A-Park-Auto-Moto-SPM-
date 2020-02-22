process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const dbUtils = require('../../../utils/dbUtils');
const faker = require('faker');
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

describe('GET /api/dashboard/tasks/parkingplaces/update', () => {
    var cookie, address, postcode, lat, lng;
    before((done) => {
        dbUtils.addARequestTest(
            "Camerino",
            "Camerano",
            "12-12-19",
            "1111111",
            10
        ).then((req) => {
            postcode = req.assignedplace.postcode;
                    dbUtils.addASensorTest(
                        req.assignedplace.postcode,
                        req.assignedplace.place.address,
                        faker.internet.ip(),
                        0, true
                    ).then((sens) => {
                        cookie = sens.headers['set-cookie'][0];
                        dbUtils.addAnOfficerTest(
                            faker.name.firstName(),
                            faker.internet.email(),
                            faker.internet.password(),
                            "aabbccdd01",
                            postcode
                        ).then(() => {
                            done();
                        }).catch((err) => done(err));
                    }).catch((err) => done(err));
                })
                .catch((err) => done(err));
    })
    it('OK, car approaching with the right license plate is allowed to park, works', (done) => {
        const licensePlate = '1111111';
        
        var options = {
            uri: 'http://localhost:3001/api/dashboard/tasks/parkingplaces/update',
            method: "POST",
            resolveWithFullResponse: true,
            simple:false,
            headers: {
                "Cookie": cookie
            },
            body: {
                update: {
                    plateNumber: licensePlate,
                    direction: "entering"
                }
            },
            json:true
        }
        request(options)
        .then((res) => {
            expect(res.statusCode).to.be.equal(200);
            done();
        })
        .catch((err) => done(err))
    });

    it('OK, legit car leaving from a parking place make the parking place status FREE', (done) => {
        const licensePlate = "1111111";
        var options = {
            uri: 'http://localhost:3001/api/dashboard/tasks/parkingplaces/update',
            method: "POST",
            resolveWithFullResponse: true,
            simple: false, //enable the usage of status codes other than 2xx
            headers: {
                "Cookie": cookie
            },
            body: {
                update: {
                    plateNumber: licensePlate,
                    direction: "leaving"
                }
            },
            json:true
        }
        request(options)
        .then((res) => {
            expect(res.statusCode).to.be.equal(304);
            done()
        })
        .catch((err) => done(err))
    });

    it('OK, car entering with a wrong license plate is not allowed and issues a violation resolution', (done) => {
        const licensePlate = 'abcdefg';
        
        var options = {
            uri: 'http://localhost:3001/api/dashboard/tasks/parkingplaces/update',
            method: "POST",
            resolveWithFullResponse: true,
            simple: false, //enable the usage of status codes other than 2xx
            headers: {
                "Cookie": cookie
            },
            body: {
                update: {
                    plateNumber: licensePlate,
                    direction: "entering"
                }
            },
            json:true
        }
        request(options)
        .then((res) => {
            expect(res.statusCode).to.be.equal(401);
            done()
        })
        .catch((err) => done(err))
    });
})