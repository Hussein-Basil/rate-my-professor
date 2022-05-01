const mongoose = require("mongoose")

const School = new mongoose.Schema({
	name			: { type: String, require: true },
	website			: { type: String, require: true },
	city			: { type: String, require: true },
	location		: { type: String },
	rating : {
		avgReputation	: { type: Number, default: 0 },
		avgFood			: { type: Number, default: 0 },
		avgOpportunity	: { type: Number, default: 0 },
		avgFacilities	: { type: Number, default: 0 },
		avgClubs		: { type: Number, default: 0 },
		avgSocial		: { type: Number, default: 0 },
		avgHappiness 	: { type: Number, default: 0 },
		avgSafety		: { type: Number, default: 0 },
		avgQuality		: { type: Number, default: 0 }
	}
})

module.exports = mongoose.model('school', School)