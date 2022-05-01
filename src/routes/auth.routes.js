const express = require('express')
const router = express.Router()

const { 
    register, 
    login, 
    logout, 
    refresh,
    verify,
    getUser
} = require('../controllers/auth.controllers')

const verifyToken = require('../middlewares/verifyToken.middleware')

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', verifyToken, logout)
router.get('/refresh', refresh)
router.get('/verify', verifyToken, verify)
router.get('/user', verifyToken, getUser)

module.exports = router