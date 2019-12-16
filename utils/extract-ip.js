function extractIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

module.exports = { extractIp };