const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRouter = require('./routes/auth.routes')
const adminRouter = require('./routes/admin.routes')
const professorRouter = require('./routes/professor.routes')
const studentRouter = require('./routes/student.routes')
const schoolRouter = require('./routes/school.routes')

const sendEmail = require('./helpers/sendEmail')

const main = async () => {
	require("dotenv").config()
	const app = express()

	app.use(express.json())
	app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

	mongoose.connect("mongodb://localhost:27017/ratemyprofessor")

	app.use("/api/auth", authRouter)
	app.use("/api/admin", adminRouter)
	app.use("/api/professor", professorRouter)
	app.use("/api/student", studentRouter)
	app.use("/api/school", schoolRouter)

	const today = new Date();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	app.listen(process.env.PORT || 8000, () => {
		console.log('[LISTENING] app is listening on port', process.env.PORT || 8000, '@', time)
	})
}

main().catch(err => {
	console.error(err)
})