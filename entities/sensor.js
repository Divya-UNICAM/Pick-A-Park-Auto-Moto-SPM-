const request = require('request-promise');
const hasher = require('../utils/salt');
const faker = require('faker');

export class Update {
    constructor(plateNumber, ipAddress) {
        this.plateNumber = hasher.encrypt(plateNumber);
        this.ipAddress = hasher.encrypt(ipAddress);
    }

    toJson() {
        return JSON.stringify(this);
    }
}

export class SimulateSensor {
    constructor(parkingPlace, ipAddress, position) {
        this.parkingPlace = parkingPlace;
        this.ipAddress = ipAddress;
        this.position = position;
    }

    randomPlateNumber(len, arr) {
        var ans = ''; 
            for (var i = len; i > 0; i--) { 
                ans +=  
                  arr[Math.floor(Math.random() * arr.length)]; 
            } 
            return ans; 
    }

    sendUpdate() {
        const update = new Update(this.randomPlateNumber(7,'1234ABCD'),faker.internet.ip());
        const data = update.toJson();
        const requestOpts = {
            encoding: 'utf8',
            uri: 'http://localhost:3001/api/dashboard/parkingplaces/update',
            method: 'POST',
            json: true,
            body: data
        };
        request(requestOpts)
            .then((body) => console.log(body))
            .catch((err) => console.log(err));
    }
}

module.exports = { Update, SimulateSensor };