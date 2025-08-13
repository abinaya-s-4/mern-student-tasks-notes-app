// server.js
require('dotenv').config();
console.log('HF_API_KEY:', process.env.HF_API_KEY ? 'Loaded' : 'Missing');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const authRoutes = require('./routes/authRouters');
const noteRoutes = require('./routes/noteRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();

// ✅ Config
const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  console.warn('⚠ FRONTEND_URL not set. Using "*" for CORS (development only)');
}

// ✅ CORS
app.use(cors({
  origin: FRONTEND_URL || '*',
  credentials: true
}));
app.options('*', cors({ origin: FRONTEND_URL || '*', credentials: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ✅ API routes
app.get('/', (req, res) => res.send('API running'));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/summary', summaryRoutes);

// ⚠ No bare "*" wildcard here (Express 5 change). If you need SPA fallback:
// app.get('/{*any}', (req, res) => { res.status(404).send('Not Found'); });

module.exports = app;

// ✅ Local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
