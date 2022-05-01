const { addProfessor } = require('./professor.controllers')
const { addStudent } = require('./student.controllers')

const Professor = require('../models/professor')
const Student = require('../models/student')

const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const mongoose = require('mongoose')
const { getCookie } = require('../helpers/cookie')

let refreshTokens = []

const register = (req, res) => {
    const { email, forProfessor } = req.body

    if (!email) {
        res.status(400).json({message: 'data is not provided'})
    }
    
    if (forProfessor) {
        addProfessor(req, res)
    } else {
        const { email, department, schoolId, password } = req.body

        if (!email || !department || !schoolId || !password) {
            res.status(400).json({ message: 'Date is not fully provided' })
        }
    
        const student = new Student({
            email,
            department,
            schoolId: mongoose.Types.ObjectId(schoolId),
        })
    
        student.hashedPassword =  student.generateHash(password)
    
        
        student.save((err) => {
            if (err) {
                return res.status(500).send(err)
            }
            
            const claims = { 
                id: student._id.toString(), 
                schoolId,
                isProfessor: false
            }
        
            const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
            const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'})
        
            res.setHeader(
                'Set-Cookie', 
                [
                    cookie.serialize('accessToken', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 60 * 60,
                        sameSite: 'strict',
                        path: '/'
                    }), 
                    cookie.serialize('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 60 * 60 * 24 * 7,
                        sameSite: 'strict',
                        path: '/'
                    })
                ]
            )
            refreshTokens.push(refreshToken)
            res.status(200).json({message: 'Student created successfully'})
        })
    }
}

const login = (req, res) => {
    const { email, password, forProfessor } = req.body
    if (forProfessor) {
        Professor.findOne({email}, (err, user) => {
            if (err) return res.status(500).send(err)
            if (!user || !user.validPassword(password)) {
                return res.status(401).json({message: 'username or password is incorrect'})
            }
            const claims = {
                id: user._id.toString(),
                schoolId: user.schoolId.toString(),
                isProfessor: true
            }
            const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
            const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.status(200).json({ accessToken, refreshToken })
        })
        return
    }
    Student.findOne({email}, (err, user) => {
        if (err) return res.status(500).send(err)
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({message: 'username or password is incorrect'})
        }
        const claims = { 
            id: user._id.toString(), 
            schoolId: user.schoolId.toString(),
            isProfessor: false 
        }

        const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
        const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'})

        res.setHeader(
            'Set-Cookie', 
            [
                cookie.serialize('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60 * 60,
                    sameSite: 'strict',
                    path: '/'
                }), 
                cookie.serialize('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: 'strict',
                    path: '/'
                })
            ]
        )
        refreshTokens.push(refreshToken)
        
        res.status(200).json({ message: 'logged in successfully' })
    })
}

const logout = (req, res) => {
    const getCookie = (key, cookies) => {
        const val = cookies.match('(^|;) ?' + key + '=([^;]*)(;|$)')
        return val ? val[2] : null
    }
    const cookies = req.headers['cookie']

    if (!cookies) {
        return res.status(401).json({message: 'no cookies'})
    }
    
    const refreshToken = getCookie('refreshToken', cookies)

    if (!refreshToken) {
        return res.status(400).json({ message: 'refersh token is not available' })
    }


    refreshTokens.filter(token => token !== refreshToken)

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
    }

    res.setHeader('Set-Cookie', 
        [
            cookie.serialize('accessToken', '', cookieOptions),
            cookie.serialize('refreshToken', '', cookieOptions)
        ]
    )

    res.status(200).json({ message: 'logout succeed' })
}

const refresh = (req, res) => {
    const cookies = req.headers['cookie']

    if (!cookies) {
        return res.status(401).json({message: 'no cookies'})
    }

    const refreshToken = getCookie('refreshToken', cookies)

    if (!refreshToken) {
        return res.status(401).json({message: 'No refresh token'})
    }

    if (refreshTokens.indexOf(refreshToken) === -1) {
        return res.status(401).json({ message: 'Refresh token is invalid' })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json(err)
        }

        delete decoded.exp
        delete decoded.iat

        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

        res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60,
            sameSite: 'strict',
            path: '/'
        }))

        res.status(200).json({ message: 'Updated accessToken' })
    })
}

const verify = (req, res) => {
    res.status(200).send('verified')
}

const getUser = (req, res) => {
    const { id, schoolId, isProfessor } = req.claims
    res.status(200).json({
        id,
        schoolId,
        isProfessor
    })
}

module.exports = {
    register, 
    login, 
    logout, 
    refresh,
    verify, 
    getUser,
    refreshTokens
}