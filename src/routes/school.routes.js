const express = require('express')
const router = express.Router()

const { getSchool, addReview, populateSchools } = require('../controllers/school.controllers')
const verifyToken = require('../middlewares/verifyToken.middleware')

router.get('/populate-schools', populateSchools)
router.post('/:id/add-review', verifyToken, addReview)
router.get('/:id?', getSchool)

module.exports = router