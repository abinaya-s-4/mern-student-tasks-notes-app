

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const authRoutes = require('./routes/authRouters');
app.use('/api/auth', authRoutes);

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);
