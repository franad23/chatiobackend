import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("DB Connected");
}

export default connectDB;