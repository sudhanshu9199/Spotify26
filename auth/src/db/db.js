import mongoose from "mongoose";
import _config from "../config/config.js";

async function connectDB() {
  try {
    await mongoose.connect(_config.MONGO_URI);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

export default connectDB;
