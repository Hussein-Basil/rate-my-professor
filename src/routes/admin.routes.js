const express = require("express")
const router = express.Router()

const adminControllers = require("../controllers/admin.controllers")
const isAdmin = require("../middlewares/isAdmin.middleware")

const { 
    getAdmin, 
    addAdmin, 
    updateAdmin, 
    deleteAdmin,
} = adminControllers

router.get("/:id?", getAdmin)
router.post("/", isAdmin, addAdmin)
router.put("/:id",  updateAdmin)
router.delete("/:id", deleteAdmin)

router.use(isAdmin)

module.exports = router
