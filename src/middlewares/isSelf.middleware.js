const verifyToken = require("./verifyToken.middleware")

const isSelf = (req, res, next) => {
    const claims = req.claims
    const id =  req.params.id

    if (!claims | !claims.id) {
        return res.status(400).send({message: 'Token is invalid'})
    }
    if (!id) {
        return res.status(500).send({message: 'user id is not given'})
    }

    if (claims.id !== id) {
        return res.status(403).send({message: 'user is not authorized'})
    }

    next()
}

module.exports = [verifyToken, isSelf]