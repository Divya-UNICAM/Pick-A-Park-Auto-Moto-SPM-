process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const dbUtils = require('../../../../utils/dbUtils');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Request = require('../../../../db/models/Request');
const ParkingPlace = require('../../../../db/models/ParkingPlace');

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

describe('POST /api/dashboard/officers/:postcode', () => {
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
    it('OK, adding a police officer works', (done) => {

            dbUtils.addAnOfficerTest(
                faker.name.firstName(),
                faker.internet.email(),
                faker.internet.password(),
                "aaaaa",
                postcode
            )
        .then((po) => {
            expect(po).not.equal(null);
            expect(po).not.equal("");
            done();
        })
        .catch((err) => done(err));
    })
});

describe('POST /api/dashboard/officers', () => {
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
    })
    it('OK, adding a police officer works', (done) => {
        var cookie;
        dbUtils.authenticateAUserTest(
            email,
            password,
            true
        ).then(res => {
            cookie = res.headers['set-cookie'][0];
            var options = {
                uri: 'http://localhost:3001/api/dashboard/officers',
                method: "POST",
                headers: {
                    "Cookie": cookie
                },
                body: {
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    badge: "aaaaa",
                    name: faker.name.firstName()
                },
                json: true,
                jar: true
            };
            request(options)
            .then((po) => {
                expect(po).not.equal(null);
                expect(po).not.equal("");
                done();
            })
            .catch((err) => done(err));
        }).catch(err => done(err));
    })
})

describe('POST /api/dashboard/officers/resolve', () => {
    var postcode, address, cookie, municipality;
    before(done => {
        dbUtils.addAMunicipalityTest(
            "Rome",
            "RM",
            "Lazio",
            faker.address.zipCode(),
            41.902782,
            12.496365,
            faker.commerce.price()
        ).then((mun) => {
            municipality = mun;
            return dbUtils.addAParkingPlaceTest(//Roma via Pomezia
                mun.postcode,
                41.902782,
                12.496365,
                faker.address.streetAddress()
            )
        }).then(pp => {
            selectedParkingPlace = pp;
            return dbUtils.addASensorTest(
                municipality.postcode,
                pp.location.address,
                faker.internet.ip(),
                0,true
            )
        }).then((sens)=>{
            cookie = sens.headers['set-cookie'][0];
            done();
        }).catch(err => done(err));
    })
    it('OK, police officer can send data to update job resolution', (done) => {
        dbUtils.addARequestTest(
            "Camerino",
            "Roma",
            Date.now(),
            "1111111",
            10, true
        ).then(() => {
            const licensePlate = "abcdefgh";
        
            let options = {
                uri: 'http://localhost:3001/api/dashboard/tasks/parkingplaces/update',
                method: "POST",
                resolveWithFullResponse: true,
                simple:false,
                jar: true,
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
            };
            request(options)
            .then((res) => {
                    expect(res.statusCode).to.be.equal(401);
                    return res.body;    
            }).then((job) => { //police officer resolves violation
                let options = {
                    uri: 'http://localhost:3001/api/dashboard/tasks/officers/resolve',
                    method: "POST",
                    body: {
                        jobId: job._id
                    },
                    json: true,
                    simple: false,
                    headers: {
                        'Cookie': process.env.AUTH_TOKEN
                    },
                    jar: true,
                    resolveWithFullResponse: true
                };
                request(options)
                .then((res) => {
                    expect(res.statusCode).to.be.equal(200);
                    done();
                }).catch(err => done(err));
            }).catch(err => done(err));
        }).catch(err => done(err));
        
    })
})
