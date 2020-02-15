process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const dbUtils = require('../../../utils/dbUtils');
const Sensor = require('../../../db/models/Sensor');
const Municipality = require('../../../db/models/Municipality');
const ParkingPlace = require('../../../db/models/ParkingPlace');
const faker = require('faker');

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
    it('OK, sending updates with the right license plate from sensor to municipality works', (done) => {
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
                    plateNumber: licensePlate
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

    it('OK, sending updates with the wrong license plate from sensor to municipality issues a violation resolution', (done) => {
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
                    plateNumber: licensePlate
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
    })
})