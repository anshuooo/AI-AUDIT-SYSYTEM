const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected to Atlas'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error!');
        console.error('Reason:', err.message);
        if (err.message.includes('authentication failed')) {
            console.error('👉 Tip: Check your username and password in the .env file.');
        }
    });

// Routes
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/lead', require('./routes/leadRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('AI Audit System API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
