const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require('dotenv').config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Village Skill Portal API is running!" });
});

// Health check endpoint for deployment platforms
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a user's room for direct messages
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle direct messages
  socket.on('send_direct_message', (data) => {
    const { receiverId, message } = data;
    io.to(`user_${receiverId}`).emit('receive_direct_message', message);
  });

  // Join a chat room (for job applications)
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat: ${chatId}`);
  });

  // Leave a chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat: ${chatId}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    io.to(data.chatId).emit('receive_message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', { 
      chatId: data.chatId, 
      userName: data.userName 
    });
  });

  // Stop typing indicator
  socket.on('stop_typing', (data) => {
    socket.to(data.chatId).emit('user_stop_typing', { 
      chatId: data.chatId 
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
