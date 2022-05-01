const mongoose = require("mongoose")

const Professor = new mongoose.Schema({
	name: { type: String, require: true },
	schoolId : { type: mongoose.Types.ObjectId, ref: 'schools', require: true },
	department: { type: String, require: true },
	courses: [String],
	rating: {
		avgQuality: Number,
		avgDifficulty: Number,
		avgTakeAgain: Number,
		qualityDistribution: {
			awesome: Number,
			great: Number,
			good: Number,
			ok: Number,
			aweful: Number
		}
	}
})

module.exports = mongoose.model('professor', Professor)
