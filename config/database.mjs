import mongoose from "mongoose";
const MONGO_URI='mongodb+srv://127014002_db_user:Achudhan 1234@cluster0.xgo3nhc.mongodb.net/'
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ");
  } catch (error) {
    console.error("MongoDB connection failed ", error.message);
    process.exit(1);
  }
};

export default connectDB;