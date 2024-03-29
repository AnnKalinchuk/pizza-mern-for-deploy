const jwt = require('jsonwebtoken');
//const config = require('config')

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET

module.exports = function(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "User is not authorized"})
        }
        
        //const decodedData = jwt.verify(token, config.get("jwtSecret"))
        const decodedData = jwt.verify(token, jwtSecret)
        req.user = decodedData

        next()
        
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "User is not authorized"})
    }

}