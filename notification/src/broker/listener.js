import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";
function startListener() {
  subscribeToQueue("user_created", (msg) => {
    const {
      email,
      role,
      fullname: { firstName, lastName },
    } = msg;

    const template = `
        <h1>Welcome to Spotify</h1>
        <p>Hi ${firstName} ${lastName},</p>
        <p>Your account has been created successfully.</p>
        <p>Thank you for joining Spotify!</p>
        `;

    sendEmail(email, "Welcome to Spotify", "", template);
  });
}

export default startListener;
