const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

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

// Express 5.x workaround for middlewares mutating req.query
app.use((req, res, next) => {
  const originalQuery = req.query;
  Object.defineProperty(req, 'query', {
    value: originalQuery,
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});

// Security Middleware Suite
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss()); // Prevent XSS Attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting (10,000 API requests per 10 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10000,
  message: { success: false, message: 'Too many requests from this IP, please try again in 10 minutes' }
});
app.use('/api/', apiLimiter);

// Routes
// Routes Initialization with Integrity Logging
console.log('--- Initializing Auth Registry ---');
app.use('/api/auth', require('./routes/authRoutes'));

console.log('--- Initializing Hackathon Registry ---');
app.use('/api/hackathons', require('./routes/hackathonRoutes'));

console.log('--- Initializing Submission Registry ---');
app.use('/api/submissions', require('./routes/submissionRoutes'));

console.log('--- Initializing User Directory ---');
app.use('/api/users', require('./routes/userRoutes'));

console.log('--- Initializing Evaluation Matrix ---');
app.use('/api/evaluations', require('./routes/evaluationRoutes'));

console.log('--- Initializing Announcement Hub ---');
app.use('/api/announcements', require('./routes/announcementRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hackathon API is running' });
});

module.exports = app;
