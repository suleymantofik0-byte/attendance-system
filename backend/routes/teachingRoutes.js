import express from "express";
import TeachingAssignment from "../models/TeachingAssignment.js";
import User from "../models/user.js";
import Course from "../models/Course.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router()

router.post("/",authMiddleware,authorize("admin"), async (req,res) => {
    
          try {
            const { teacherId, courseId } = req.body;

            if (!teacherId || !courseId) {
                return res.status(400).json({
                    message: "Teacher ID and course ID are required"
                });
            }

            const teacher = await User.findById(teacherId);

            if (!teacher) {
                return res.status(404).json({
                    message: "Teacher not found"
                });
            }

            if (teacher.role !== "teacher") {
                return res.status(400).json({
                    message: "Selected user is not a teacher"
                });
            }

            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            const existingAssignment =
                await TeachingAssignment.findOne({
                    teacher: teacherId,
                    course: courseId
                });

            if (existingAssignment) {
                return res.status(409).json({
                    message: "Teacher is already assigned to this course"
                });
            }

            const assignment = await TeachingAssignment.create({
                teacher: teacherId,
                course: courseId
            });

            res.status(201).json({
                message: "Teacher assigned successfully",
                assignment
            });
          }
            
     catch (error) {
                    console.error(error);

            res.status(500).json({
                message: "Server error"
            });
    }
}
)

router.get("/my-courses",authMiddleware,authorize("teacher"), async (req,res)=> {
    try {

        

        const assignments = await TeachingAssignment.find({
            teacher : req.user.userId
        }).populate("course")

        res.status(200).json({
            courses: assignments.map((assignment)=> assignment.course)
        })

    } catch (error) {
         console.error(error);

            res.status(500).json({
                message: "Server error"
            });
    }
})

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    async (req, res) => {
        try {
            const assignments = await TeachingAssignment.find()
                .populate("teacher", "fullName email")
                .populate("course", "course classType")

            res.status(200).json({
                assignments
            })

        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: "Server error"
            })
        }
    }
)

router.delete("/:assignmentId", authMiddleware, authorize("admin"), async (req,res)=> {
    try {
        const { assignmentId } = req.params

        const assignment = await TeachingAssignment.findById(assignmentId)

        if (!assignment) {
            return res.status(404).json({
                message: "teaching assignment not found"
            })
        }

        await TeachingAssignment.findByIdAndDelete(assignmentId)

        res.status(200).json({
            message : "teacher removed successfully"
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "server error"
        })
    }
})

export default router