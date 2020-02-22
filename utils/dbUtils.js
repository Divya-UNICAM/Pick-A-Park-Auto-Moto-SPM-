const db = require('../db/index');
const request = require('request-promise');
const faker = require('faker');
const Municipality = require('../db/models/Municipality');
const ParkingPlace = require('../db/models/ParkingPlace');
const Request = require('../db/models/Request');

const deg2rad = (deg) => {
    return deg * (Math.PI/180);
};

const rad2deg = (rad) => {
    return rad * (180/Math.PI);
};

function getDistance(stLat,stLng,tgLat,tgLng) {
    const theta = stLng - tgLng;
    let distance = Math.sin(deg2rad(stLat)) * Math.sin(deg2rad(tgLat))
        + Math.cos(deg2rad(stLat)) * Math.cos(deg2rad(tgLat)) * Math.cos(theta);
    distance = Math.acos(distance);
    distance = rad2deg(distance);
    distance = distance * 60 * 1.1515 * 1.609344; //distance in Km
    return distance;
}

async function forwardGeocoding(place) {
    var json = {
        location: place
    }
    var options = {
        method: "post",
        body: json,
        json: true,
        uri: "http://www.mapquestapi.com/geocoding/v1/address?key=EQGn6RdZOa3LaRlvqT3QYhpeCwKjoLhO"
    };
    return request(options)
        .then((response) => {
            return response.results[0].locations[0].latLng;
        })
        .catch((err) => {
            return err;
        });
  }

//Quick user creation for testing functionalities
async function addAUserTest(email, password, privileges, domain, fullResponse=false) {
    
    const user = {
        name: faker.name.firstName(),
        email: email,
        password: password,
        privileges: privileges,
        domain: domain
    };
    var options = {
        method: 'POST',
        uri: 'http://localhost:3001/api/users/register',
        body: user,
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: fullResponse
    };
    //console.log('User added '+addedUser.password);
    return request(options);
        
}

async function authenticateAUserTest(email, password, fullResponse=false) {
    const body = {
        email: email,
        password: password
    }
    var options = {
        method: "POST",
        uri: "http://localhost:3001/api/users/login",
        body: body,
        json: true,
        jar: true,
        resolveWithFullResponse: fullResponse
    }
    return request(options);
}

//Quick adding for a police officer
async function addAnOfficerTest(name,email,password,badge,postcode) {
    const officer = {
        name: name,
        email: email,
        password: password,
        badge: badge
    }
    var options = {
        method: "POST",
        headers: {
            "Cookie": process.env.AUTH_TOKEN
        },
        uri: "http://localhost:3001/api/dashboard/officers/"+postcode,
        body: officer,
        json: true
    }
    return request(options);
}

//Quick municipality creation for testing functionalities
async function addAMunicipalityTest(name, province, region, postcode, latitude, longitude,price, fullResponse=false) {
    
    const municipality = {
        name: name,
        province: province,
        region: region,
        postcode: postcode,
        location: {
            lat: latitude,
            lng: longitude
        },
        pricePerMinute: price
    };
    var options = {
        method: "POST",
        headers: {
            "Cookie": process.env.AUTH_TOKEN
        },
        uri: "http://localhost:3001/api/dashboard/municipalities",
        body: municipality,
        json: true,
        resolveWithFullResponse: fullResponse
    };
    return request(options);
}

//Quick parking place creation for testing functionalities
async function addAParkingPlaceTest(postcode, latitude, longitude, address, fullResponse=false, status='FREE') {
    const parkingPlace = {
        location: {
            lat: latitude,
            lng: longitude,
            address: address
        },
        status: status
    };
    var options = {
        method: "POST",
        headers: {
            "Cookie": process.env.AUTH_TOKEN
        },
        uri: "http://localhost:3001/api/dashboard/parkingplaces/"+postcode,
        body: parkingPlace,
        json: true,
        resolveWithFullResponse: fullResponse
    };
    return request(options);

}

async function addARequestTest(startLoc, targLoc, date, plate, duration, fullResponse=false) {
    const req = {
        startingLocation: await forwardGeocoding(startLoc),
        targetLocation: await forwardGeocoding(targLoc),
        date: date,
        licensePlate: plate,
        duration: duration
    }

    var options = {
        method: "post",
        uri: "http://localhost:3001/api/request",
        body: req,
        json: true,
        resolveWithFullResponse: fullResponse,
        jar: true
    }
    return request(options);
}

async function addASensorTest(postcode, address, ipAddress, position, fullResponse=false) {
    const urlAddress = encodeURI(address.toLowerCase());
    const sensor = {
        position: position,
        ipAddress: ipAddress
    }

    var options = {
        method: "POST",
        headers: {
            "Cookie": process.env.AUTH_TOKEN
        },
        uri: 'http://localhost:3001/api/dashboard/sensors/'+postcode+'/'+urlAddress,
        body: sensor,
        json: true,
        resolveWithFullResponse: fullResponse
    }
    return request(options);
}

//
async function getNearParkingPlaces(destination) {
    let places = [];
    //For each parking place compute the distance with the destination
    //Pick as possible candidates only those below a certain distance threshold
    try {
        const possibleParkingPlaces = await ParkingPlace.find({
            status: 'FREE'
        });
        if(possibleParkingPlaces.length > 0) {
            await Promise.all(possibleParkingPlaces.map(async element => {
                    const mun = await Municipality.findById(element.municipality);
                    places.push({
                        "municipality": element.municipality,
                        "postcode": mun.postcode,
                        "parkingplace": element.id,
                        "price": mun.pricePerMinute,
                        "place": element.location,
                        "distance":getDistance(destination.lat,destination.lng,
                            element.location.lat,element.location.lng)
                    });
                })
            );
        }
        if(places.length <= 0)
            return "target location too far";
        return places;
    } catch (err) {
        return err;
    }
}

async function getNearParkingPlacesByAStartingLocation(startingLocation) {
    let places = [];
    //For each parking place compute the distance with the destination
    //Pick as possible candidates only those below a certain distance threshold
    try {
        const possibleParkingPlaces = await ParkingPlace.find({
            status: 'FREE'
        });
        if(possibleParkingPlaces.length > 0) {
            await Promise.all(possibleParkingPlaces.map(async element => {
                    const mun = await Municipality.findById(element.municipality);
                    places.push({
                        "municipality": element.municipality,
                        "postcode": mun.postcode,
                        "parkingplace": element.id,
                        "price": mun.pricePerMinute,
                        "place": element.location,
                        "distance":getDistance(startingLocation.lat,startingLocation.lng,
                            element.location.lat,element.location.lng)
                    });
                })
            );
        }
        if(places.length <= 0)
            return "target location too far";
        return places;
    } catch (err) {
        return err;
    }
}

module.exports = { 
    addAUserTest,
    authenticateAUserTest,
    addAnOfficerTest, 
    addAMunicipalityTest,
    addAParkingPlaceTest,
    addARequestTest,
    addASensorTest,
    getNearParkingPlaces,
    getDistanceBetween: getNearParkingPlacesByAStartingLocation
};