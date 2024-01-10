const jwt = require('jsonwebtoken');
//const config = require('config')

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    
    /* return jwt.sign(payload, config.get("jwtSecret"), {expiresIn: "30d"} ) */
    return jwt.sign(payload, jwtSecret, {expiresIn: "30d"} )
}

module.exports = generateAccessToken