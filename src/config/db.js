import mongoose from "mongoose";



const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB CONNECTION SUCCESS");
    } catch (error) {
        console.log("DB CONNECTION FAILED",error);
        throw new Error("DB CONNECTION FAILED",error);
    }
}
export default connectDB;