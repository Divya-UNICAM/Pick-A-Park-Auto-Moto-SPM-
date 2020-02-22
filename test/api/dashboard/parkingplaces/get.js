process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const dbUtils = require('../../../../utils/dbUtils');
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

describe('GET /api/dashboard/parkingplaces', () => {
    var cookie, email, password;
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
            dbUtils.addAParkingPlaceTest(
                mun.postcode,
                faker.address.latitude(),
                faker.address.longitude(),
                faker.address.streetAddress()
            )
            email = faker.internet.email();
            password = faker.internet.password();
            dbUtils.addAUserTest(
                email,
                password,
                4,
                mun.postcode
            ).then(() => {
                dbUtils.authenticateAUserTest(
                    email,
                    password,
                    true
                ).then((res) => {
                    cookie = res.headers['set-cookie'][0];
                    done();
                }).catch((err) => done(err));
            })
            .catch((err) => done(err));
        }).catch((err) => done(err));
    });
        
    it('OK, getting all parking places from municipality inferred from user cookie', (done) => {
        var options = {
            uri: 'http://localhost:3001/api/dashboard/parkingplaces',
            headers: {
                "Cookie":cookie
            },
            method: "GET",
            resolveWithFullResponse: true
        }
        request(options)
            .then((res) => {
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch((err) => done(err));
    })
});

describe('GET /api/dashboard/parkingplaces/:postcode', () => {
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
            dbUtils.addAParkingPlaceTest(
                mun.postcode,
                faker.address.latitude(),
                faker.address.longitude(),
                faker.address.streetAddress()
            ).then(() => done())
            .catch((err) => done(err));
        }).catch((err) => done(err));
    });
        
    it('OK, getting all parking places from a specific municipality', (done) => {
        var options = {
            uri: 'http://localhost:3001/api/dashboard/parkingplaces/'+postcode,
            headers: {
                "Cookie":process.env.AUTH_TOKEN
            },
            method: "GET",
            resolveWithFullResponse: true
        }
        request(options)
            .then((res) => {
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch((err) => done(err));
    })

});

describe('GET /api/dashboard/parkingplaces/:postcode/:address', () => {
    var postcode,address;
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
            ).then(() => done())
            .catch((err) => done(err));
        }).catch((err) => done(err));
    });
        
    it('OK, getting a parking place from a specific municipality and address', (done) => {
        var options = {
            uri: 'http://localhost:3001/api/dashboard/parkingplaces/'+postcode+'/'+address,
            headers: {
                "Cookie":process.env.AUTH_TOKEN
            },
            method: "GET",
            resolveWithFullResponse: true
        }
        request(options)
            .then((res) => {
                expect(res.statusCode).to.be.equal(200);
                done();
            })
            .catch((err) => done(err));
    })

});