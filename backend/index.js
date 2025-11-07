// Load ENV First
require('dotenv').config();

// Import Models
require('./models/Property');
require('./models/Inquiry');
require('./models/Appointment');
require('./models/Dashboard');
require('./models/Project');
require('./models/LandTitle');
require('./models/Compliance');
require('./models/Contractor');

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
console.log('PORT from env:', process.env.PORT);
console.log('Final PORT:', PORT);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Simple password storage (in production, use a database)
let currentAdminPassword = process.env.ADMIN_PASSWORD || 'pesante254';

// Whitelisted Origins from ENV
const whiteList = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: true,
  credentials: true
}));

// Security & Middleware
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

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token', details: err.message });
    req.user = user;
    next();
  });
};

// Field Validator
const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field]);
  if (missing.length) {
    return res.status(400).json({ error: 'Missing fields', fields: missing });
  }
  next();
};

// Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbState: mongoose.connection.readyState,
    uptime: process.uptime()
  });
});

// ENV Debug Route
app.get('/api/envcheck', (req, res) => {
  res.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  });
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Incoming:', username, password);
  console.log('Current password:', currentAdminPassword);

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
  
  console.log('Change password attempt:', { username, oldPassword: '***', newPassword: '***' });
  console.log('Current password:', currentAdminPassword);
  
  if (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    oldPassword === currentAdminPassword
  ) {
    // Update the stored password
    currentAdminPassword = newPassword;
    console.log('Password changed successfully');
    return res.json({ success: true, message: 'Password changed successfully' });
  }

  console.log('Invalid current password');
  res.status(401).json({ success: false, error: 'Invalid current password' });
});

// Protected Data Routes

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

// Dashboard Routes
app.get('/api/dashboard/:propertyId', authenticateToken, async (req, res) => {
  const Dashboard = mongoose.model('Dashboard');
  const dashboard = await Dashboard.findOne({ property_id: req.params.propertyId }).populate('property_id');
  res.json(dashboard || { property_id: req.params.propertyId, metrics: {}, alerts: [] });
});

app.post('/api/dashboard', authenticateToken, validateRequired(['property_id']), async (req, res) => {
  const Dashboard = mongoose.model('Dashboard');
  const dashboard = new Dashboard({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await dashboard.save();
  res.status(201).json({ success: true, id: dashboard._id });
});

// Project Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  const Project = mongoose.model('Project');
  const projects = await Project.find().populate('property_id contractor_id').sort({ created_at: -1 });
  res.json(projects);
});

app.post('/api/projects', authenticateToken, validateRequired(['name', 'start_date', 'end_date', 'budget']), async (req, res) => {
  const Project = mongoose.model('Project');
  const project = new Project({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await project.save();
  res.status(201).json({ success: true, id: project._id });
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const Project = mongoose.model('Project');
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ error: 'Invalid project ID' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const Project = mongoose.model('Project');
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid project ID' });
  }
});

// Land Title Routes
app.get('/api/land-titles', authenticateToken, async (req, res) => {
  const LandTitle = mongoose.model('LandTitle');
  const titles = await LandTitle.find().populate('property_id').sort({ created_at: -1 });
  res.json(titles);
});

app.post('/api/land-titles', authenticateToken, validateRequired(['title_number', 'property_id', 'owner_name', 'land_size', 'location', 'registration_date']), async (req, res) => {
  const LandTitle = mongoose.model('LandTitle');
  const title = new LandTitle({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await title.save();
  res.status(201).json({ success: true, id: title._id });
});

app.put('/api/land-titles/:id', authenticateToken, async (req, res) => {
  const LandTitle = mongoose.model('LandTitle');
  try {
    const title = await LandTitle.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!title) return res.status(404).json({ error: 'Land title not found' });
    res.json({ success: true, title });
  } catch (error) {
    res.status(400).json({ error: 'Invalid land title ID' });
  }
});

app.delete('/api/land-titles/:id', authenticateToken, async (req, res) => {
  const LandTitle = mongoose.model('LandTitle');
  try {
    const title = await LandTitle.findByIdAndDelete(req.params.id);
    if (!title) return res.status(404).json({ error: 'Land title not found' });
    res.json({ success: true, message: 'Land title deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid land title ID' });
  }
});

// Compliance Routes
app.get('/api/compliance', authenticateToken, async (req, res) => {
  const Compliance = mongoose.model('Compliance');
  const compliance = await Compliance.find().populate('property_id').sort({ expiry_date: 1 });
  res.json(compliance);
});

app.post('/api/compliance', authenticateToken, validateRequired(['property_id', 'permit_type', 'permit_number', 'issuing_authority', 'issue_date', 'expiry_date']), async (req, res) => {
  const Compliance = mongoose.model('Compliance');
  const permit = new Compliance({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await permit.save();
  res.status(201).json({ success: true, id: permit._id });
});

app.put('/api/compliance/:id', authenticateToken, async (req, res) => {
  const Compliance = mongoose.model('Compliance');
  try {
    const permit = await Compliance.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!permit) return res.status(404).json({ error: 'Compliance record not found' });
    res.json({ success: true, permit });
  } catch (error) {
    res.status(400).json({ error: 'Invalid compliance ID' });
  }
});

app.delete('/api/compliance/:id', authenticateToken, async (req, res) => {
  const Compliance = mongoose.model('Compliance');
  try {
    const permit = await Compliance.findByIdAndDelete(req.params.id);
    if (!permit) return res.status(404).json({ error: 'Compliance record not found' });
    res.json({ success: true, message: 'Compliance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid compliance ID' });
  }
});

// Contractor Routes
app.get('/api/contractors', authenticateToken, async (req, res) => {
  const Contractor = mongoose.model('Contractor');
  const contractors = await Contractor.find().sort({ rating: -1 });
  res.json(contractors);
});

app.post('/api/contractors', authenticateToken, validateRequired(['name', 'company', 'phone', 'email', 'hourly_rate']), async (req, res) => {
  const Contractor = mongoose.model('Contractor');
  const contractor = new Contractor({ ...req.body, created_at: new Date(), updated_at: new Date() });
  await contractor.save();
  res.status(201).json({ success: true, id: contractor._id });
});

app.put('/api/contractors/:id', authenticateToken, async (req, res) => {
  const Contractor = mongoose.model('Contractor');
  try {
    const contractor = await Contractor.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!contractor) return res.status(404).json({ error: 'Contractor not found' });
    res.json({ success: true, contractor });
  } catch (error) {
    res.status(400).json({ error: 'Invalid contractor ID' });
  }
});

app.delete('/api/contractors/:id', authenticateToken, async (req, res) => {
  const Contractor = mongoose.model('Contractor');
  try {
    const contractor = await Contractor.findByIdAndDelete(req.params.id);
    if (!contractor) return res.status(404).json({ error: 'Contractor not found' });
    res.json({ success: true, message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid contractor ID' });
  }
});

// Serve static files from React app in production
if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  
  // Serve static files (CSS, JS, images, etc.)
  app.use(express.static(frontendPath, { index: false }));
  
  // Serve index.html for all non-API GET requests (SPA routing)
  // This must be after static files but before error handlers
  app.get('*', (req, res, next) => {
    // Skip API routes - they should have been handled above
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
    }
    // Serve index.html for all other routes (SPA fallback)
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        next(err);
      }
    });
  });
} else {
  // 404 & Error Fallbacks (development - API routes only)
  // In development, frontend is served separately by Vite
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: `API route ${req.originalUrl} not found` });
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Connect DB and Launch Server
mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log(`MongoDB connected in ${NODE_ENV} mode`);
    app.listen(PORT, () => {
      console.log(`
Server running at http://localhost:${PORT}
API: /api/
Health: /api/health
ENV: ${NODE_ENV}
MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
      `);
    });
  })
  .catch(err => {
    console.error('MongoDB failed to connect:', err.message);
    process.exit(1);
  });
