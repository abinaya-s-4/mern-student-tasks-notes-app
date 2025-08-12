require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRouters');
const noteRoutes = require('./routes/noteRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();

// Use FRONTEND_URL if set, otherwise your local dev URL
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => res.send('API running'));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/summary', summaryRoutes);

// ✅ Export the app for Vercel
module.exports = app;

// ✅ Only listen locally in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
