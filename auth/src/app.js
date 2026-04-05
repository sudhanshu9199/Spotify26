import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev")); // for logging
app.use(express.json()); // for parsing json data
app.use(express.urlencoded({ extended: true })); // for parsing url encoded data
app.use(cookieParser()); // for parsing cookies
app.use("/api/auth", authRoutes);

export default app;
