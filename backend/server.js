import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import messageRoutes from "./routes/message.route.js";
import Message from "./models/Message.model.js";
import User from "./models/User.model.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/conversations", messageRoutes);

// Save messages
app.post("/messages", async (req, res) => {
  try {
    console.log(req.body);
    const { chatId, sender, text, fileUrl } = req.body;
    const newMessage = new Message({ chatId, sender, text, fileUrl });
    await newMessage.save();
    res.status(201).send("Message saved!");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch messages
app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// File upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    filename: req.file.filename,
    path: path.join("uploads", req.file.filename),
  });
});

// File download route
app.get("/download/:filename", (req, res) => {
  const filePath = path.resolve("uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

const users = new Map(); // Store online users (userId -> socketId)

// **Socket.io Connection**
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // **Handle user joining with userId**
  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("newGroup", (groupData) => {
    groupData.members
      .filter((member) => member !== groupData.sender)
      .forEach((receiverId) => {
        if (users.has(receiverId)) {
          io.to(users.get(receiverId)).emit("newGroup", {
            groupId: groupData.group,
            name: groupData.name,
            members: groupData.members,
          });
        }
      });
  });

  // **Send & Save Message**
  socket.on("sendMessage", async (messageData) => {
    const { sender, receivers, group, text, files } = messageData;

    const message = new Message({ sender, receivers, group, text, files });
    await message.save();

    const senderObj = await User.findById(sender);

    // **Send message to all receivers (individual or group)**
    console.log({ receivers, group });
    receivers.forEach((receiverId) => {
      if (users.has(receiverId)) {
        io.to(users.get(receiverId)).emit("newMessage", {
          conversation: message.group || message.sender,
          text: message.text,
          files: message.files,
          title: senderObj.name,
        });
      }
    });
  });

  // **Handle user disconnect**
  socket.on("disconnect", () => {
    users.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        users.delete(userId);
      }
    });
    console.log("User Disconnected:", socket.id);
  });
});

// **API: Get Conversations**
app.get("/api/getConversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const userConversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receivers: userId },
            { group: { $ne: null } },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$group", false] },
              "$group",
              { $setIntersection: [["$sender", "$receivers"]] },
            ],
          },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    res.json(userConversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
