const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Student = new mongoose.Schema({
    schoolId		: 	{ type: mongoose.Types.ObjectId, ref: 'school', require: true },
	email			: { type: String, require: true , unique: true},
	department		: { type: String, require: true },
	hashedPassword	: { type: String, require: true },
	verifiedEmail	: { type: Boolean, default: false },
	verifiedStudent : { type: Boolean, default: false }
})


Student.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
Student.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.hashedPassword)
}

module.exports = mongoose.model('student', Student)
