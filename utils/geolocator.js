const request = require('request-promise');
//User sends his/her IP address in the request and the server resolves it as geohash coordinates

let retIp = null;

function geolocate(ip) {
    //Limited to 45 requests per minute from same IP address
    return request.get('http://ip-api.com/json/'+ip)
        .then((body) => {return body;})
        .catch((err) => {return err;})
}

module.exports = { geolocate };