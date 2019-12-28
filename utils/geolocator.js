const request = require('request-promise');
//User sends his/her IP address in the request and the server resolves it as geohash coordinates

function geolocate(ip) {
    //Limited to 45 requests per minute from same IP address
    return request.get('http://ip-api.com/json/'+ip)
        .then((body) => {return body;})
        .catch((err) => {return err;})
}

function geolocatev2(ip) {
    return request.get('https://api.ipgeolocationapi.com/geolocate/'+ip)
        .then((body) => {
            obj = {
                latitude: body.geo.latitude,
                longitude: body.geo.longitude
            };
            return obj;
        })
        .catch((err) => {
            return err;
        })
}

function geolocatev3(ip) {
    return request.get('https://freegeoip.app/json/'+ip)
        .then((body) => {
            return body;
        })
        .catch((err) => {
            return err;
        })
}

function reverseGeolocatev1(address) {
    return request.get('https://api.openrouteservice.org/geocode/search?api_key='+process.env.OPEN_ROUTE_API+'&text='+address)
        .then((body) => {
            return JSON.parse(body).features[0].geometry.coordinates; //return the array with geo coordinates of the location
        })
        .catch((err) => {
            return err;
        })
}

module.exports = { geolocate, geolocatev2, geolocatev3, reverseGeolocatev1 };