import { Server } from "socket.io";
import http from "http";
import express from "express";
import prisma from "../utils/prismClient.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null; // Returns null if user is offline
}

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (!userId) {
    console.log("No userId found, disconnecting socket:", socket.id);
    return socket.disconnect();
  }

  // Validate userId in database
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (userExists) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("Invalid userId, disconnecting:", userId);
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
