import express from "express";
import sendEmail from "./utils/email.js";

const app = express();

sendEmail(
  "shudhanshukumar9713@gmail.com",
  "Test Email",
  "This is a test email from Spotify26",
  "<h1>This is a test email from Spotify26</h1>",
);

export default app;
