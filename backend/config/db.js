import mongoose from "mongoose"


const DB = async ()=> {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB conneted successfully ✅")
    } catch (error) {
      console.error("MongoDB connection failed ❌", error.message)
         process.exit(1)
    }
}

export default DB