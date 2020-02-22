process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const dbUtils = require('../../../../utils/dbUtils');
const tough = require('tough-cookie').Cookie;
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


describe('POST /api/dashboard/parkingplaces', () => {
    var postcode;
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
            done();
        }).catch((err) => done(err));
    })
    it('OK, adding a new parking place works', (done) => {
        dbUtils.addAParkingPlaceTest(
            postcode,
            faker.address.latitude(),
            faker.address.longitude(),
            faker.address.streetAddress(),
            true
        ).then((res) => {
            expect(res).to.have.property('statusCode',200);
            done();
        }).catch((err) => done(err));
    })
})

