const Admin = require("../models/admins")
const verifyToken = require("./verifyToken.middleware")

const isAdmin = (req, res, next) => {
    const { username } = req.claims

    if (!username) {
        return res.status(403).send({message: 'You are not admin'})
    }

    Admin.findOne({ username }, (err, admin) => {
        if (err) return res.status(500).send(err)
        if (admin) next()
    })
}

// one middleware can be array of middleware functions
module.exports = [verifyToken, isAdmin]