const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Request logger
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });
  next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hackathon API is running' });
});

module.exports = app;
