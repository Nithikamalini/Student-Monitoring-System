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
mongoose.connect('mongodb://localhost:27017/student_monitoring')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:');
        console.error(err);
        process.exit(1); // Exit on connection failure
    });

// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

// Serve Frontend Static Files
const __dirname_resolved = path.resolve();
app.use(express.static(path.join(__dirname_resolved, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname_resolved, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
