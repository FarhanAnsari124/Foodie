import mongoose from "mongoose"

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDb Connected successfully!")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;