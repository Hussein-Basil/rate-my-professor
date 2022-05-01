const express = require("express")
const router = express.Router()

const studentControllers = require("../controllers/student.controllers")
const verifyToken = require("../middlewares/verifyToken.middleware")
const isSelf = require("../middlewares/isSelf.middleware")


const { 
    getStudent, 
    addStudent, 
    updateStudent, 
    deleteStudent,
} = studentControllers

router.get("/:id?", getStudent)
router.post("/", addStudent)
router.put("/:id", isSelf, updateStudent)
router.delete("/:id", isSelf, deleteStudent)

module.exports = router
