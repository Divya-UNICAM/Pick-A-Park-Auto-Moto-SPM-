process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const ParkingPlace = require('../../../../db/models/ParkingPlace');
const Municipality = require('../../../../db/models/Municipality');
const db = require('../../../../db/index');
const server = require('../../../../server');

before((done) => {
    db.connect()
    .then(() => done())
    .catch((err) => done(err));
})

describe('GET /parkingplaces', () => {
    beforeEach((done) => {
        //Mock sensors and parking places
        
        const municpt1 = new Municipality({
            name: 'Camerino',
            province: 'MC',
            region: 'Marche',
            postcode: 62032,
            location: {
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            }
        }).save();
        municpt1.then((doc) => {
            new ParkingPlace({
                municipality: doc.id,
                location: {
                    lat: faker.address.latitude(),
                    lng: faker.address.longitude(),
                    address: 'Via Alano, 23'
                }
            }).save();
            done();
        }).catch((err) => done(err));
    });
        
    it('should get all parking places', (done) => {
        request(server).get('/api/dashboard/parkingplaces/62032')
            .set("Cookie",'auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
            .then((res) => {
                expect(res.status).to.be.equal(200);
                done();
            })
            .catch((err) => done(err));
    })
})