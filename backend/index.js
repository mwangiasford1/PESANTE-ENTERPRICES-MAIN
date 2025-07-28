// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';
// Security middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5174', 'http://localhost:4000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('💥 MongoDB connection error:', err);
  process.exit(1);
});
// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("🔒 Token verification failed:", err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
// Validation middleware
const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }
  next();
};
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'pesante254';
    
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true,
        message: "Login successful",
        token,
        expiresIn: '24h'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await mongoose.model('Property').find()
      .sort({ created_at: -1 });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});
app.post('/api/properties', authenticateToken, validateRequired(['title', 'location', 'type', 'price']), async (req, res) => {
  try {
    const property = new mongoose.model('Property')({
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    });
    await property.save();
    res.status(201).json({ success: true, id: property._id });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: "Failed to create property" });
  }
});
// Appointments routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await mongoose.model('Appointment').find()
      .sort({ datetime: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
app.post('/api/appointments', validateRequired(['name', 'datetime']), async (req, res) => {
  try {
    const appointment = new mongoose.model('Appointment')({
      ...req.body,
      created_at: new Date(),
      status: 'pending'
    });
    await appointment.save();
    res.status(201).json({ success: true, id: appointment._id });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});
// Inquiries routes
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await mongoose.model('Inquiry').find()
      .sort({ created_at: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});
app.post('/api/inquiries', validateRequired(['name', 'message']), async (req, res) => {
  try {
    const inquiry = new mongoose.model('Inquiry')({
      ...req.body,
      created_at: new Date(),
      status: 'new'
    });
    await inquiry.save();
    res.status(201).json({ success: true, id: inquiry._id });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: "Failed to create inquiry" });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
});