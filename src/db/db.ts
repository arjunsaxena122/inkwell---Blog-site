import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";
import { env } from "../config/config";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGO_URI);
    console.log(
      `Database connect successfully : ${connectionInstance.connection.host}`,
    );
  } catch (err) {
     new ApiError(503, `ERROR:Database conneciton failed: ${err}`, [err]);
     process.exit(1)
  }
};

export default connectDB; 
