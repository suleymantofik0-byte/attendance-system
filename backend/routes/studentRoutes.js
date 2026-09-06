import  express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router()


router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    async (req, res) => {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                return res.status(400).json({
                    message: "Full name, email and password are required"
                });
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const student = await User.create({
                fullName,
                email,
                password: hashedPassword,
                role: "student"
            });

            res.status(201).json({
                message: "Student created successfully",
                student: {
                    id: student._id,
                    fullName: student.fullName,
                    email: student.email,
                    role: student.role
                }
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);

export default router;