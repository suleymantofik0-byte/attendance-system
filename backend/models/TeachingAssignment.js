import mongoose from "mongoose";

const teachingAssignmentSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true
    }
);

const TeachingAssignment = mongoose.model(
    "TeachingAssignment",
    teachingAssignmentSchema
);

export default TeachingAssignment;