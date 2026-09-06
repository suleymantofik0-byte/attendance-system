import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true
        },

        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

teacherAttendanceSchema.index(
    { teacher: 1, course: 1, date: 1 },
    { unique: true }
);

const TeacherAttendance = mongoose.model(
    "TeacherAttendance",
    teacherAttendanceSchema
);

export default TeacherAttendance;