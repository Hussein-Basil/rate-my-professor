const Student = require("../models/student")
const mongoose = require('mongoose')
require('dotenv').config()

let refreshTokens = []

const getStudent = (req, res) => {
    const callback = (err, doc) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json(doc)
    }

    if (!req.params.id) {
        Student.find({}, callback)
    } else {
        Student.findById(req.params.id, callback)
    }
}

 // Register a new student
const addStudent = (req, res) => {
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
        res.status(200).json({message: 'Student created successfully'})
    })
}

// Update a student
const updateStudent = (req, res) => {
    const id = req.params.id
    const updates = req.body

    Student.findByIdAndUpdate(id, updates, (err, student) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({message: 'Student updated successfully'})
    })

}

// Delete a student
const deleteStudent = (req, res) => {
    const id = req.params.id
    Student.findByIdAndRemove(id, (err, student) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({message: 'Student deleted successfully'})
    })
}

module.exports = {
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent,
}