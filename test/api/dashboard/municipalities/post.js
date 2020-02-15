process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const dbUtils = require('../../../../utils/dbUtils');
const tough = require('tough-cookie').Cookie;

describe('POST /api/dashboard/municipalities', () => {

    it('OK, adding a new municipality works', (done) => {

        dbUtils.addAMunicipalityTest(
            faker.address.city(),
            faker.address.countryCode(),
            faker.address.country(),
            faker.address.zipCode(),
            faker.address.latitude(),
            faker.address.longitude(),
            faker.commerce.price(),
            true
        ).then((res) => {
            expect(res).to.have.property('statusCode',200);
            done();
        })
        .catch((err) => done(err));
    })
})
