const Admin = require("../models/admins")
const jwt = require("jsonwebtoken")

let refreshTokens = []

const getAdmin = (req, res) => {
    if (req.params.id) {
        Admin.findOneById(req.params.id, (err, admin) => {
            if (err) return res.status(500).send(err)
            res.status(200).json(admin)
        })
    } 
    else {
        Admin.find({}, (err, admins) => {
            if (err) return res.status(500).send(err)
            res.status(200).json(admins)
        })
    }
}

const addAdmin = (req, res) => {
    const { name, email, hashedPassword } = req.body
    const admin = new Admin({
        name,
        email,
        hashedPassword
    })
    admin.save((err, doc) => {
        if (err) return res.status(500).send(err)
        res.status(201).send(doc)
    })
}

const updateAdmin = (req, res) => {
    const id = req.params.id
    Event.findByIdAndUpdate(id, req.body, (err, event) => {
        if (err) {
            return res.status(500).send(err) 
        }
        res.status(200).json({message: 'Event updated successfully'})
    })
}

const deleteAdmin = (req, res) => {
    const id = req.params.id
    Admin.findByIdAndRemove(id, (err, doc) => {
        if (err) return res.status(500).send(err)
        res.json({message: 'Admin deleted successfully'})
    })
}

const loginAdmin = (req, res) => {
    const { email, password } = req.body
    Admin.findOne({email}, (err, admin) => {
        if (err) return res.status(500).send(err)
        if (!admin || !admin.validPassword(password)) {
            return res.status(401).json({message: 'username or password is incorrect'})
        }
        const claims = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
        }
        const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'})
        const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        res.status(200).json({ accessToken, refreshToken })
    })

}

const logoutAdmin = (req, res) => {
    if (req.body.refreshToken) {
        return res.status(401).send({message: 'Refresh token missing'})
    }
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
    res.status(204).json({message: 'Logout successed'})
}

const getClaims = (req, res) => {
    const claims = req.claims
    if (!claims) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    res.status(200).json(claims)
}

const setClaims = (req, res) => {
    const claims = req.body.claims
    const oldRefreshToken = req.body.refreshToken

    const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'})

    // deleting orphan refresh token
    refreshTokens = refreshTokens.filter(token => token !== oldRefreshToken)

    // adding new one with new claims
    const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)

    res.status(200).json({ accessToken, refreshToken })
}

module.exports = {
    getAdmin,
    addAdmin,
    updateAdmin,
    deleteAdmin,

    loginAdmin,
    logoutAdmin,

    getClaims,
    setClaims
}