import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {});
}
