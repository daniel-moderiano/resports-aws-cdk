import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // MongoDB connection string
    const mongoUri: string = process.env.MONGO_URI || "";

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      // type guard
      console.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.log("Unexpected error type encountered: ", error);
    }
  }
};

export default connectDB;
