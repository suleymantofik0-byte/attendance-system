import express from "express";
import Course from "../models/Course.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router()

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    async (req, res) => {
        try {
            const { course, classType } = req.body;

            if (!course || !classType) {
                return res.status(400).json({
                    message: "Course and class type are required"
                });
            }

            const existingCourse = await Course.findOne({
                course,
                classType
            });

            if (existingCourse) {
                return res.status(409).json({
                    message: "This course already exists"
                });
            }

            const newCourse = await Course.create({
                course,
                classType
            });

            res.status(201).json({
                message: "Course created successfully",
                course: newCourse
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Server error"
            });
        }
    }
)


// Any logged-in user can read the course list (needed to fill dropdowns)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 })

        res.status(200).json({ courses })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router
