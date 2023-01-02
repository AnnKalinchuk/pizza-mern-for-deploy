const jwt = require('jsonwebtoken');
const config = require('config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    
    return jwt.sign(payload, config.get("jwtSecret"), {expiresIn: "30d"} )
}

module.exports = generateAccessToken