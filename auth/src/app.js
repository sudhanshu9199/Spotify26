import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config/config.js";

const app = express();

app.use(morgan("dev")); // for logging
app.use(express.json()); // for parsing json data
app.use(express.urlencoded({ extended: true })); // for parsing url encoded data
app.use(cookieParser()); // for parsing cookies
app.use(passport.initialize());
app.use("/api/auth", authRoutes);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: config.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

export default app;
