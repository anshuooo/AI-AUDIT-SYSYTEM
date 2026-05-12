const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Production-ready CORS configuration
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increase limit for large audit data

// MongoDB Connection with modern syntax
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error!');
    console.error('Reason:', err.message);
    if (err.message.includes('authentication failed')) {
      console.error('👉 Tip: Check your username and password in the .env file.');
    }
    if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('👉 Tip: Check your MongoDB URI and network connection.');
    }
    process.exit(1); // Exit on connection failure in production
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Runtime Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
});

// Routes
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/lead', require('./routes/leadRoutes'));

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('AI Audit System API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler - Express 5 compatible catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
