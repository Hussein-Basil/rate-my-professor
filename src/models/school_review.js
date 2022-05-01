const mongoose = require("mongoose")

const SchoolReview = new mongoose.Schema({
    schoolId: { type: mongoose.Types.ObjectId, ref: 'school', require: true },
    studentId: { type: mongoose.Types.ObjectId, ref: 'student', require: true },
    verifiedStudent: { type: Boolean, default: false },
    reputation: { type: Number, require: true },
    food: { type: Number, require: true },
    opportunity: { type: Number, require: true },
    facilities: { type: Number, require: true },
    clubs: { type: Number, require: true },
    social: { type: Number, require: true },
    happiness: { type: Number, require: true },
    safety: { type: Number, require: true },
    comment: { type: String, require: true }
}, {
    timestamps: true
})

module.exports = mongoose.model("school_review", SchoolReview)
