const bcrypt = require('bcryptjs');

var salt = null;

async function generateSalt() {
    salt = await bcrypt.genSalt(10);
}

function getSalt() {
    return salt;
}

module.exports = { generateSalt, getSalt };