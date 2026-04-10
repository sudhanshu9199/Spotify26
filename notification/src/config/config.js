import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const _config = {
  CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
};

export default Object.freeze(_config);
