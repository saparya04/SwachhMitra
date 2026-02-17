const User = require('./models/User');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');


// Load environment variables from .env file
dotenv.config();

const userRoutes = require('./routes/userRoutes.js');
const eventRoutes = require('./routes/eventRoute');     //NEW

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection successful!'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if connection fails
  });

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('SwachhMitra Backend is running!');
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { conversationId, senderId, senderName, text } = data;
    
    // Save to MongoDB
    const newMessage = new Message({ conversationId, senderId, senderName, text });
    await newMessage.save();

    // Broadcast to the room
    io.to(conversationId).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



// ---Chat---
// Route to fetch users by role for the chat list
app.get('/api/users/list-by-role/:role', async (req, res) => {
  try {
    const roleToFind = req.params.role.toLowerCase();
    // Query MongoDB for users with that role
    const users = await User.find({ role: roleToFind });
    res.json(users);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// for chat history retrieval
// Add this route to server.js to fix the 404 history error
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});




// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});