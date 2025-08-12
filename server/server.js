// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRouters');
const noteRoutes = require('./routes/noteRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();

// Load frontend URL from env
const FRONTEND_URL = process.env.FRONTEND_URL;

// Main CORS config
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Handle preflight
app.options('*', cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Force CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => res.send('API running'));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/summary', summaryRoutes);

// Export for Vercel
module.exports = app;

// Run locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
