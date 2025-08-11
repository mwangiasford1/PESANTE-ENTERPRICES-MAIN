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
const path = require('path');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const app = express();
const PORT = process.env.PORT || 4000;
console.log('🔧 PORT from env:', process.env.PORT);
console.log('🔧 Final PORT:', PORT);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Simple password storage (in production, use a database)
let currentAdminPassword = process.env.ADMIN_PASSWORD || 'pesante254';

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
  console.log('🛠️ Current password:', currentAdminPassword);

  if (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    password === currentAdminPassword
  ) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, message: 'Login successful', token, expiresIn: '24h' });
  }

  res.status(401).json({ success: false, error: 'Authentication failed', message: 'Invalid credentials' });
});

app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  
  console.log('🔐 Change password attempt:', { username, oldPassword: '***', newPassword: '***' });
  console.log('🔐 Current password:', currentAdminPassword);
  
  if (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    oldPassword === currentAdminPassword
  ) {
    // Update the stored password
    currentAdminPassword = newPassword;
    console.log('✅ Password changed successfully');
    return res.json({ success: true, message: 'Password changed successfully' });
  }

  console.log('❌ Invalid current password');
  res.status(401).json({ success: false, error: 'Invalid current password' });
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

app.put('/api/properties/:id', authenticateToken, validateRequired(['title', 'location', 'type', 'price']), async (req, res) => {
  const Property = mongoose.model('Property');
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(400).json({ error: 'Invalid property ID' });
  }
});

app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
  const Property = mongoose.model('Property');
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid property ID' });
  }
});

app.post('/api/inquiries', validateRequired(['name', 'email', 'message']), async (req, res) => {
  const Inquiry = mongoose.model('Inquiry');
  const inquiry = new Inquiry({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await inquiry.save();
  res.status(201).json({ success: true, id: inquiry._id });
});

app.get('/api/inquiries', authenticateToken, async (req, res) => {
  const Inquiry = mongoose.model('Inquiry');
  const data = await Inquiry.find().sort({ created_at: -1 });
  res.json(data);
});

app.put('/api/inquiries/:id', authenticateToken, validateRequired(['name', 'email', 'message']), async (req, res) => {
  const Inquiry = mongoose.model('Inquiry');
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(400).json({ error: 'Invalid inquiry ID' });
  }
});

app.delete('/api/inquiries/:id', authenticateToken, async (req, res) => {
  const Inquiry = mongoose.model('Inquiry');
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid inquiry ID' });
  }
});

app.post('/api/appointments', validateRequired(['name', 'phone', 'property_id', 'date']), async (req, res) => {
  const Appointment = mongoose.model('Appointment');
  const appointment = new Appointment({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await appointment.save();
  res.status(201).json({ success: true, id: appointment._id });
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
  const Appointment = mongoose.model('Appointment');
  const data = await Appointment.find().sort({ created_at: -1 });
  res.json(data);
});

app.put('/api/appointments/:id', authenticateToken, validateRequired(['name', 'phone', 'property_id', 'date']), async (req, res) => {
  const Appointment = mongoose.model('Appointment');
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ error: 'Invalid appointment ID' });
  }
});

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  const Appointment = mongoose.model('Appointment');
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid appointment ID' });
  }
});

// 🌐 Serve static files from frontend build
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // 🔄 Fallback: serve React app for all non-API routes
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      const indexPath = path.join(frontendPath, 'index.html');
      console.log('Serving frontend from:', indexPath);
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
} else {
  // ❗ 404 for development
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
  });
}
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
