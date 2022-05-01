const mongoose = require("mongoose")


const ProfessorReview = new mongoose.Schema({
	professorId	: { type: mongoose.Types.ObjectId, ref: 'professor', require: true },
	studentId	: { type: mongoose.Types.ObjectId, ref: 'student', require: true },
	verifiedStudent : { type: Boolean, default: false },
	course		: { type: String, require: true },
	courseYear	: { type: Date, require: true },
	onlineCourse: { type: Boolean, default: false},
	quality 	: { type: Number, require: true },
	difficulty	: { type: Number, require: true },
	textBookUse : { type: Boolean, require: true },
	takeAgain	: Boolean,
	attendance  : Boolean,
	grade		: String,
	comment		: String,
	tags		: [String],
}, {
	timestamps: true
})

module.exports = mongoose.model("professor_review", ProfessorReview)
