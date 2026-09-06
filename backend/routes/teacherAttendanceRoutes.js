import express from "express";
import TeacherAttendance from "../models/teacherAttendance.js";
import TeachingAssignment from "../models/TeachingAssignment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router()

router.post("/", authMiddleware, authorize("admin"), async (req,res)=> {
    try {
        const { teacherId, courseId, date, status } = req.body


         if (!teacherId || !courseId || !date || !status) {
                return res.status(400).json({
                    message: "Teacher, course, date and status are required"
                });
            }

             const validStatuses = ["present", "absent", "late"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid attendance status"
                });
            }

              const assignment = await TeachingAssignment.findOne({
                teacher: teacherId,
                course: courseId
            });

            if (!assignment) {
                return res.status(400).json({
                    message: "This teacher is not assigned to this course"
                });
            }

             const attendanceDate = new Date(
                `${date}T00:00:00.000Z`
            )

            const teacherAttendance = await TeacherAttendance.create({
                teacher: teacherId,
                course: courseId,
                date: attendanceDate,
                status,
                recordedBy: req.user.userId
            })

             return res.status(201).json({
                message: "Teacher attendance recorded successfully",
                attendance: teacherAttendance
            })


    } catch (error) {
        console.error(error);

            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Attendance has already been recorded for this teacher, course and date"
                });
            }

            return res.status(500).json({
                message: "Server error"
            })
    }
})

router.get("/", authMiddleware, authorize("admin"), async (req,res)=> {
    try {

         const { teacherId, courseId, date } = req.query

         const filter = {}

         if(teacherId) {
            filter.teacher = teacherId
         }

           if (courseId) {
                filter.course = courseId;
            }

            if (date) {
                filter.date = new Date(
                    `${date}T00:00:00.000Z`
                )
            }

              const attendance = await TeacherAttendance.find(filter)
                .sort({ date: -1 })
                .populate("teacher", "fullName email")
                .populate("course", "course classType")
                .populate("recordedBy", "fullName")

                return res.status(200).json({
                attendance
            })

    }
    catch (error) {

          console.error(error);

            return res.status(500).json({
                message: "Server error"
            })
    }
})

router.patch(
    "/:attendanceId",
    authMiddleware,
    authorize("admin"),
    async (req, res) => {
        try {
            const { attendanceId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    message: "Status is required"
                });
            }

            const validStatuses = ["present", "absent", "late"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid attendance status"
                });
            }

            const attendance = await TeacherAttendance.findById(
                attendanceId
            );

            if (!attendance) {
                return res.status(404).json({
                    message: "Teacher attendance record not found"
                });
            }

            attendance.status = status;

            await attendance.save();

            return res.status(200).json({
                message: "Teacher attendance updated successfully",
                attendance
            });

        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: "Server error"
            })
        }
    }
)

export default router