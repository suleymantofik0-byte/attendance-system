import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import dns from "dns"

import DB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import enrollmentRoutes from "./routes/enrollmentRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import teachingRoutes from "./routes/teachingRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import correctionRequestRoutes from "./routes/correctionRequestRoutes.js"
import teacherAttendanceRoutes from "./routes/teacherAttendanceRoutes.js"

// Load the .env file FIRST, so every line below can read process.env
dotenv.config()

// Use Google's DNS (helps when the network cannot resolve MongoDB Atlas)
dns.setServers(["8.8.8.8", "8.8.4.4"])

const app = express()
const PORT = process.env.PORT || 3000

DB()

// Let the React app (running on a different port) call this API
app.use(cors())

// Let Express read JSON bodies sent by the frontend
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send({ message: "attendance app is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/teaching", teachingRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/correction-requests", correctionRequestRoutes)
app.use("/api/teacher-attendance", teacherAttendanceRoutes)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
