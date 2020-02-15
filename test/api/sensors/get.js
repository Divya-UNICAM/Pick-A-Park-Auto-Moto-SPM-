process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const dbUtils = require('../../../utils/dbUtils');
const Sensor = require('../../../db/models/Sensor');
const Municipality = require('../../../db/models/Municipality');
const ParkingPlace = require('../../../db/models/ParkingPlace');
const faker = require('faker');

describe('GET /api/dashboard/sensors/:postcode/:address', () => {
    var postcode, address;
    before((done) => {
        dbUtils.addAMunicipalityTest(
            faker.address.city(),
            faker.address.countryCode(),
            faker.address.country(),
            faker.address.zipCode(),
            faker.address.latitude(),
            faker.address.longitude(),
            faker.commerce.price()
        ).then((mun) => {
            postcode = mun.postcode;
            address = faker.address.streetAddress();
            dbUtils.addAParkingPlaceTest(
                mun.postcode,
                faker.address.latitude(),
                faker.address.longitude(),
                address
            ).then((pp) => {
                dbUtils.addASensorTest(
                    postcode,
                    address,
                    faker.internet.ip(),
                    0
                ).then(() => done())
                .catch((err) => done(err));
            })
            .catch((err) => done(err));
        }).catch((err) => done(err));
    })
    it('OK, retrieving all sensors from a parking place in a municipality', (done) => {
        var options = {
            uri: 'http://localhost:3001/api/dashboard/sensors/'+postcode+'/'+address,
            method: "GET",
            resolveWithFullResponse: true,
            headers: {
                "Cookie": process.env.AUTH_TOKEN
            }
        }
        request(options)
        .then((res) => {
            expect(res.statusCode).to.be.equal(200);
            done()
        })
        .catch((err) => done(err))
    })
})