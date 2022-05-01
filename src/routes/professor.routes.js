const express = require("express")

const professorControllers = require("../controllers/professor.controllers")
const isAdmin = require("../middlewares/isAdmin.middleware")
const verifyToken = require("../middlewares/verifyToken.middleware")

const router = express.Router()

const { 
    getProfessor, 
    addProfessor, 
    updateProfessor, 
    deleteProfessor,
    rateProfessor
} = professorControllers

router.get("/:id", getProfessor)
router.post("/", addProfessor)
router.put("/:username", isAdmin, updateProfessor)
router.delete("/:username", isAdmin, deleteProfessor)

router.post('/rate/:id', verifyToken, rateProfessor)

module.exports = router
