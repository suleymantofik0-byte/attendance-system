import mongoose from "mongoose"

const courseSchema = new mongoose.Schema(
    {
          course: {
            type: String,
            required: true,
            trim: true
        },

        classType: {
            type: String,
            enum: ["regular", "weekend", "extension"],
            required: true
        }
    }
    ,
        {
            timestamps : true
        }
) 

const Course = mongoose.model("Course", courseSchema)

export default Course