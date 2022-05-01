const jwt = require('jsonwebtoken')
const { getCookie } = require('../helpers/cookie')
const { refresh } = require('../controllers/auth.controllers')

module.exports = (req, res, next) => {
    const cookies = req.headers['cookie']

    if (!cookies) {
        return res.status(401).json({ message: 'no cookies'})
    }

    const accessToken = getCookie('accessToken', cookies)

    if (!accessToken || accessToken === 'undefined') {
        return res.status(401).json({ message: 'undefined token'})
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'error verifying token', error: err})
        }
        req.claims = decoded
        next()
    })
}