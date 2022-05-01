const School = require('../models/school')
const Student = require('../models/student')
const SchoolReview = require('../models/school_review')
const Professor = require('../models/professor')
const schools = require('../data/schools')
const mongoose = require('mongoose')

const getSchool = (req, res) => {
    if (req.params.id) {
        School.findById(req.params.id, async (err, school) => {
            if (err) return res.status(500).json({message: err.message})
            if (!school) {
                return res.status(400).send('no such school')
            }
            const professors = await Professor.find({ schoolId: school._id }).sort({'rating.avgQuality': -1 }).limit(10)
            const reviews = await SchoolReview.find({ schoolId: school._id  }).sort({'createdAt': -1}).limit(10)

            return res.status(200).json({ school, professors, reviews })
        })
    }
    else {
        School.find({}).sort({'rating.avgQuality': -1}).exec((err, schools) => {
            if (err) return res.status(500).json({message: err.message})
            return res.status(200).json(schools)
        })
    }
}

const addSchool = (req, res) => {
    const { name, city, location, website, emailDomain } = req.body

    const school = new School({
        name: name,
        city: city,
        location: location,
        website: website,
        emailDomain: emailDomain,
        professors: [],
        students: 0
    })

    school.save((err, doc) => {
        if (err) return res.status(500).send(err)
        else     return res.status(201).json({message: 'School added successfully', doc})
    })
}

const updateSchool = (req, res) => {
    const id = req.params.id

    School.findByIdAndUpdate(id, req.body, (err, school) => {
        if (err) return res.status(500).json(err)
        else     return res.status(200).json({message: 'School updated successfully'})
    })
    
}
const deleteSchool = (req, res) => {
    const id = req.params.id
    School.findByIdAndRemove(id, (err, school) => {
        if (err) return res.status(500).json(err)
        else     return res.status(202).json({message: 'School deleted successfully'})
    })
}


const addReview = async (req, res) => {
    const reviewData = req.body
    const { schoolId: studentSchoolId } = req.claims
    const schoolId = req.params.id

    if (studentSchoolId !== schoolId) {
        return res.status(403).json({ message: 'student is not member of this school' })
    }

    const review = new SchoolReview(reviewData)
    review.save((err, doc) => {
        if (err) {
            return res.status(500).json({ message: 'error saving review'})
        }
        SchoolReview.aggregate([
            {$match: {schoolId: mongoose.Types.ObjectId(schoolId)}},
            {$group: {
                _id: null, 
                avgReputation: {$avg: '$reputation'},
                avgFood: {$avg: '$food'},
                avgOpportunity: {$avg: '$opportunity'},
                avgFacilities: {$avg: '$facilities'},
                avgClubs: {$avg: '$clubs'},
                avgSocial: {$avg: '$social'},
                avgHappiness: {$avg: '$happiness'},
                avgSafety: {$avg: '$safety'}
            }},
            {$addFields: {
                avgQuality: {$avg: [
                    '$avgReputation', '$avgFood', '$avgOpportunity', 
                    '$avgFacilities', '$avgClubs', '$avgSocial', 
                    '$avgHappiness', '$avgSafety'
                ]}
            }}
        ], async (err, aggregate) => {
            if (err) return res.status(500).json({ message: 'error updating school rating' })
            const result = aggregate[0]
            if (result === undefined) {
                return console.log('aggregation failed')
            }
            const newSchool = await School.findOneAndUpdate({_id: mongoose.Types.ObjectId(schoolId)}, {
                rating: {
                    avgReputation: Number(result.avgReputation.toFixed(1)),
                    avgFood: Number(result.avgFood.toFixed(1)),
                    avgOpportunity: Number(result.avgOpportunity.toFixed(1)),
                    avgFacilities: Number(result.avgFacilities.toFixed(1)),
                    avgClubs: Number(result.avgClubs.toFixed(1)),
                    avgSocial: Number(result.avgSocial.toFixed(1)),
                    avgHappiness: Number(result.avgHappiness.toFixed(1)),
                    avgSafety: Number(result.avgSafety.toFixed(1)),
                    avgQuality: Number(result.avgQuality.toFixed(1))
                }
            })
        })
    })

    return res.status(200).json({ message: 'done successfully'})
}   
const populateSchools = (req, res) => {
    School.insertMany(schools)
        .then(s => res.status(200).json(s))
        .catch(err => res.status(500).json(err))
}

module.exports = {
    getSchool,
    addSchool,
    updateSchool,
    deleteSchool,
    addReview,
    populateSchools
}