const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for the React Native app
app.use(cors()); 
// Parse incoming JSON payloads
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connection successful!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if connection fails
    });

// --- API Routes ---
// Use the user routes, prefixed with '/api/users'
app.use('/api/users', userRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('SwachhMitra Backend is running!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}`);
});
