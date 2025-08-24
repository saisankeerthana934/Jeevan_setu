
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const http = require('http');
// const socketIo = require('socket.io');
// require('dotenv').config();

// // --- 🔽 ADD THIS CODE FOR DEBUGGING 🔽 ---
// console.log("--- CHECKING EMAIL SETTINGS FROM .env FILE ---");
// console.log("Email Host:", process.env.EMAIL_HOST);
// console.log("Email Port:", process.env.EMAIL_PORT);
// console.log("-------------------------------------------");
// // --- 🔼 END OF DEBUGGING CODE 🔼 ---


// // Import routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const donorRoutes = require('./routes/donors');
// const bloodRequestRoutes = require('./routes/bloodRequests');
// const doctorRoutes = require('./routes/doctors');
// const ngoRoutes = require('./routes/ngos');
// const notificationRoutes = require('./routes/notifications');
// const educationRoutes = require('./routes/education');
// const publicRoutes = require('./routes/public');

// // Import middleware
// const { errorHandler } = require('./middleware/errorHandler');
// const { notFound } = require('./middleware/notFound');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// // Security middleware
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);


// // --- CORRECTED CORS CONFIGURATION ---
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://1e40e70f73ec.ngrok-free.app" // Your ngrok URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));


// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ Connected to MongoDB Atlas'))
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
//   socket.on('join-room', (userId) => socket.join(userId));
//   socket.on('disconnect', () => console.log('User disconnected:', socket.id));
// });

// // Make io accessible to routes
// app.set('io', io);

// // Health check endpoint
// app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/donors', donorRoutes);
// app.use('/api/blood-requests', bloodRequestRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/ngos', ngoRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/education', educationRoutes);
// app.use('/api/public', publicRoutes); 

// // Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 JeevanSetu server running on port ${PORT}`));

// process.on('SIGTERM', () => {
//   server.close(() => {
//     mongoose.connection.close();
//     process.exit(0);
//   });
// });

// module.exports = app;

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const http = require('http');
// const socketIo = require('socket.io');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const donorRoutes = require('./routes/donors');
// const bloodRequestRoutes = require('./routes/bloodRequests');
// const doctorRoutes = require('./routes/doctors');
// const ngoRoutes = require('./routes/ngos');
// const notificationRoutes = require('./routes/notifications');
// const educationRoutes = require('./routes/education');
// const publicRoutes = require('./routes/public');
// const dashboardRoutes = require('./routes/dashboard'); 

// // Import middleware
// const { errorHandler } = require('./middleware/errorHandler');
// const { notFound } = require('./middleware/notFound');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"]
//   }
// });

// // Security middleware
// app.use(helmet());
// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 150, // Increased limit slightly
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);


// // --- THIS IS THE CORRECTED CORS CONFIGURATION ---
// // This version is simple and reliable for both local development and ngrok.
// const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// app.use(cors({
//   origin: frontendUrl,
//   credentials: true
// }));
// // --- END OF CORRECTION ---


// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ Connected to MongoDB Atlas'))
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
//   socket.on('join-room', (userId) => socket.join(userId));
//   socket.on('disconnect', () => console.log('User disconnected:', socket.id));
// });

// // Make io accessible to routes
// app.set('io', io);

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/donors', donorRoutes);
// app.use('/api/blood-requests', bloodRequestRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/ngos', ngoRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/education', educationRoutes);
// app.use('/api/public', publicRoutes);
// app.use('/api/dashboard', dashboardRoutes); 

// // Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 JeevanSetu server running on port ${PORT}`));

// module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// --- LOGGING TO CONFIRM .env IS LOADED ---
console.log("--- SERVER STARTING ---");
console.log("FRONTEND_URL from .env:", process.env.FRONTEND_URL);
console.log("-----------------------");

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const donorRoutes = require('./routes/donors');
const bloodRequestRoutes = require('./routes/bloodRequests');
const doctorRoutes = require('./routes/doctors');
const ngoRoutes = require('./routes/ngos');
const notificationRoutes = require('./routes/notifications');
const educationRoutes = require('./routes/education');
const publicRoutes = require('./routes/public');
const dashboardRoutes = require('./routes/dashboard');


// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const server = http.createServer(app);

// --- FLEXIBLE CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions
});
// --- END OF CORS CONFIGURATION ---


// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join-room', (userId) => socket.join(userId));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Make io accessible to routes
app.set('io', io);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 JeevanSetu server running on port ${PORT}`));

module.exports = app;