console.log('Server process starting...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_monitoring';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:');
        console.error(err);
        if (process.env.NODE_ENV !== 'production') {
            console.error("!!! DATABASE CONNECTION FAILED !!!");
            console.error("Please make sure MongoDB is running.");
        }
    });

// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

// Root health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running smoothly' });
});

// Serve Frontend Static Files if built, otherwise provide API status
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'Student Monitoring System API is running...', env: process.env.NODE_ENV });
    });
}

// Always start the server unless running in Vercel Serverless environment
if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`⚠️  Port ${PORT} is already in use!`);
            console.error(`   Please run: npx kill-port ${PORT}`);
        } else {
            console.error("Server Error:", e);
        }
    });
}

module.exports = app;
