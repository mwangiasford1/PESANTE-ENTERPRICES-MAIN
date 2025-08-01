// ✅ Load ENV First!
require('dotenv').config();

// 📦 Import Models
require('./models/Property');
require('./models/Inquiry');
require('./models/Appointment');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ✅ Whitelisted Origins from ENV
const whiteList = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    console.log('🔍 CORS Origin:', origin);
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 🔐 Security & Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try later.' }
}));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🔐 JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token', details: err.message });
    req.user = user;
    next();
  });
};

// 📏 Field Validator
const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field]);
  if (missing.length) {
    return res.status(400).json({ error: 'Missing fields', fields: missing });
  }
  next();
};

// 🩺 Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbState: mongoose.connection.readyState,
    uptime: process.uptime()
  });
});

// 🧪 ENV Debug Route
app.get('/api/envcheck', (req, res) => {
  res.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  });
});

// 🔐 Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('🧪 Incoming:', username, password);
  console.log('🛠️ ENV credentials:', process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

  if (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    password === (process.env.ADMIN_PASSWORD || 'pesante254')
  ) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, message: 'Login successful', token, expiresIn: '24h' });
  }

  res.status(401).json({ success: false, error: 'Authentication failed', message: 'Invalid credentials' });
});

// 🔧 Protected Data Routes

app.get('/api/properties', async (req, res) => {
  const Property = mongoose.model('Property');
  const data = await Property.find().sort({ created_at: -1 });
  res.json(data);
});

app.post('/api/properties', authenticateToken, validateRequired(['title', 'location', 'type', 'price']), async (req, res) => {
  const Property = mongoose.model('Property');
  const property = new Property({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await property.save();
  res.status(201).json({ success: true, id: property._id });
});

app.post('/api/inquiries', authenticateToken, validateRequired(['name', 'email', 'message']), async (req, res) => {
  const Inquiry = mongoose.model('Inquiry');
  const inquiry = new Inquiry({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await inquiry.save();
  res.status(201).json({ success: true, id: inquiry._id });
});

app.post('/api/appointments', authenticateToken, validateRequired(['name', 'phone', 'property_id', 'date']), async (req, res) => {
  const Appointment = mongoose.model('Appointment');
  const appointment = new Appointment({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await appointment.save();
  res.status(201).json({ success: true, id: appointment._id });
});

// ❗ 404 & Error Fallbacks
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// 🚀 Connect DB and Launch Server
mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log(`✅ MongoDB connected in ${NODE_ENV} mode`);
    app.listen(PORT, () => {
      console.log(`
🚀 Server running at http://localhost:${PORT}
📱 API: /api/
🏥 Health: /api/health
🌍 ENV: ${NODE_ENV}
📦 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
      `);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB failed to connect:', err.message);
    process.exit(1);
  });
