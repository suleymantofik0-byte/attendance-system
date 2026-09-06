import mongoose from "mongoose";

const correctionRequestSchema = new mongoose.Schema(
    {
        attendance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendance",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        requestedStatus: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const CorrectionRequest = mongoose.model(
    "CorrectionRequest",
    correctionRequestSchema
);

export default CorrectionRequest;