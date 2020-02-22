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

describe('GET /api/dashboard/officers/:postcode', () => {
    var email, password, postcode;
    before(done => {
        dbUtils.addAMunicipalityTest(
            faker.address.city(),
            faker.address.countryCode(),
            faker.address.country(),
            faker.address.zipCode(),
            faker.address.latitude(),
            faker.address.longitude(),
            faker.commerce.price()
        ).then(mun => {
            postcode = mun.postcode;
            dbUtils.addAnOfficerTest(
                faker.name.firstName(),
                faker.internet.email(),
                faker.internet.password(),
                "aaaaaa",
                postcode
            ).then(() => {
                email = faker.internet.email();
                password = faker.internet.password();
                dbUtils.addAUserTest(
                    email,
                    password,
                    4,
                    mun.postcode
                ).then(() => {
                    done();
                }).catch(err => done(err));
            }).catch(err => done(err));
        }).catch(err => done(err));
    })
    it('OK, retrieving all police officers from explicit postcode works', (done) => {
        var cookie;
        //Login the municipality admin
        dbUtils.authenticateAUserTest(
            email,
            password,
            true
        ).then(res => {
            cookie = res.headers['set-cookie'][0];
            var options = {
                uri: 'http://localhost:3001/api/dashboard/officers/'+postcode,
                method: "GET",
                headers: {
                    'Cookie': cookie
                },
                resolveWithFullResponse: true
            }
            request(options)
            .then((res) => {
                expect(res).to.have.property('statusCode',200);
                done();
            }).catch((err) => done(err));
        }).catch(err => done(err));
    })
})

describe('GET /api/dashboard/officers', () => {
    var email, password, postcode;
    before(done => {
        dbUtils.addAMunicipalityTest(
            faker.address.city(),
            faker.address.countryCode(),
            faker.address.country(),
            faker.address.zipCode(),
            faker.address.latitude(),
            faker.address.longitude(),
            faker.commerce.price()
        ).then(mun => {
            postcode = mun.postcode;
            dbUtils.addAnOfficerTest(
                faker.name.firstName(),
                faker.internet.email(),
                faker.internet.password(),
                "aaaaaa",
                postcode
            ).then(() => {
                email = faker.internet.email();
                password = faker.internet.password();
                dbUtils.addAUserTest(
                    email,
                    password,
                    4,
                    mun.postcode
                ).then(() => {
                    done();
                }).catch(err => done(err));
            }).catch(err => done(err));
        }).catch(err => done(err));
    })
    it('OK, retrieving all police officers from inferred municipality works', (done) => {
        var cookie;
        //Login the municipality admin
        dbUtils.authenticateAUserTest(
            email,
            password,
            true
        ).then(res => {
            cookie = res.headers['set-cookie'][0];
            var options = {
                uri: 'http://localhost:3001/api/dashboard/officers',
                method: "GET",
                headers: {
                    'Cookie': cookie
                },
                resolveWithFullResponse: true
            }
            request(options)
            .then((res) => {
                expect(res).to.have.property('statusCode',200);
                done();
            }).catch((err) => done(err));
        }).catch(err => done(err));
    })
})

describe('GET /api/dashboard/tasks/officers/:postcode/:badge/:jobs', () => {
    var email, password, postcode, badge;
    before(done => {
        dbUtils.addAMunicipalityTest(
            faker.address.city(),
            faker.address.countryCode(),
            faker.address.country(),
            faker.address.zipCode(),
            faker.address.latitude(),
            faker.address.longitude(),
            faker.commerce.price()
        ).then(mun => {
            postcode = mun.postcode;
            badge = "aaaaaa";
            dbUtils.addAnOfficerTest(
                faker.name.firstName(),
                faker.internet.email(),
                faker.internet.password(),
                badge,
                postcode
            ).then(() => {
                email = faker.internet.email();
                password = faker.internet.password();
                dbUtils.addAUserTest(
                    email,
                    password,
                    4,
                    mun.postcode
                ).then(() => {
                    done();
                }).catch(err => done(err));
            }).catch(err => done(err));
        }).catch(err => done(err));
    })
    it('OK, retrieving jobs for a police officer after a violation occurs results in a non-empty list', (done) => {
        var cookie;
        //Login the municipality admin
        dbUtils.authenticateAUserTest(
            email,
            password,
            true
        ).then(res => {
            cookie = res.headers['set-cookie'][0];
            var options = {
                uri: 'http://localhost:3001/api/dashboard/tasks/officers/'+postcode+'/'+badge+'/jobs',
                method: "GET",
                headers: {
                    'Cookie': cookie
                },
                resolveWithFullResponse: true
            }
            request(options)
            .then((res) => {
                expect(res).to.have.property('statusCode',200);
                expect(res.body).to.not.be.equal(null);
                expect(res.body).to.not.be.equal("");
                expect(res.body).to.not.be.equal([]);
                done();
            }).catch((err) => done(err));
        }).catch(err => done(err));
    });
})

