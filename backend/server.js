console.log('Server process starting...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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
        // Do not exit in production, allow for retries or debugging
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    });

// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

// Serve Frontend Static Files (Deployment Helper)
// In production (e.g. Render/Heroku), the backend can serve the built frontend
// On Vercel, this is handled by vercel.json rewrites
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    // __dirname is the directory of this file (backend folder)
    const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');

    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        // Only serve index.html if it's not an API request
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'Student Monitoring System API is running...', env: process.env.NODE_ENV });
    });
}

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
