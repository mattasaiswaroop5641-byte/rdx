require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate Limiting Setup
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply rate limiter to all API routes

// Basic health check route
app.get('/', (req, res) => {
    res.send('RDX Backend is running securely.');
});

// Attach Authentication Routes
app.use('/api/auth', require('./auth'));
app.use('/api/admin', require('./admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));