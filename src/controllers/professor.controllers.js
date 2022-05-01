const Professor = require("../models/professor")

const getProfessor = (req, res) => {
    Professor.findById(req.params.id, (err, professor) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json(professor)
    })
}

 // Register a new professor
const addProfessor = (req, res) => {
    const { name, schoolId, department, courses } = req.body
    const professor = new Professor({name, schoolId, department, courses})

    professor.save((err) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({message: 'Professor created successfully'})
    })
}

// Update a professor
const updateProfessor = (req, res) => {
    Professor.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({message: 'Professor updated successfully'})
    })

}

// Delete a professor
const deleteProfessor = (req, res) => {
    Professor.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({message: 'Professor deleted successfully'})
    })
}

const rateProfessor = (req, res) => {
    
}

module.exports = {
    getProfessor,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    rateProfessor
}