const jwt = require('jsonwebtoken');

require('dotenv').config();
const authorize = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(200).json({
            status: 1,
            error: "No token provided"
        })
    }
    else if (!auth.startsWith("Bearer ")) {
        return res.status(200).json({
            status: 1,
            error: "No token provided"
        })
    }
    jwt.verify(auth.substring(7), process.env.SECRET, (err, decodedtoken) => {
        if (err) {
            return res.status(200).json({
                status: 1,
                error: "Invalid token"
            })
        }
        req.usertoken = decodedtoken;
        next()
    })
}
module.exports = authorize;