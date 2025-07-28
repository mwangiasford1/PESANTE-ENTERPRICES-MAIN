// index.js - EXPRESS 4.x COMPATIBLE VERSION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
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
// MongoDB connection
let db;
async function connectToMongoDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    db = client.db();
    
    // Test connection
    await db.admin().ping();
    console.log("💓 Database ping successful");
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Available collections:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("💥 MongoDB connection error:", err.message);
    process.exit(1);
  }
}
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
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: db ? 'connected' : 'disconnected',
    version: process.env.npm_package_version || '1.0.0'
  });
});
// Admin login endpoint
jsx
const handleLogin = async () => {
  try {
    // Make sure the credentials object is correctly defined
    const credentials = { username, password };
    console.log('Sending login credentials:', credentials);
    
    // If using axios:
    const response = await axios.post('/api/admin/login', credentials);
    const data = response.data;
    console.log('Login response:', data);
    
    if (data.success) {
      // Proceed with a successful login
    } else {
      // Handle unsuccessful login attempt
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
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
  } try  (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.collection("properties")
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});
app.post('/api/properties', authenticateToken, validateRequired(['title', 'location', 'type', 'price']), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection("properties").insertOne(propertyData);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: "Failed to create property" });
  }
});
// Appointments routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await db.collection("appointments")
      .find({})
      .sort({ datetime: 1 })
      .toArray();
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
app.post('/api/appointments', validateRequired(['name', 'datetime']), async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      created_at: new Date(),
      status: 'pending'
    };
    const result = await db.collection("appointments").insertOne(appointmentData);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});
// Inquiries routes
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await db.collection("inquiries")
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});
app.post('/api/inquiries', validateRequired(['name', 'message']), async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      created_at: new Date(),
      status: 'new'
    };
    const result = await db.collection("inquiries").insertOne(inquiryData);
    res.status(201).json({ success: true, id: result.insertedId });
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
async function startServer() {
  try {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📱 API endpoints available at http://localhost:${PORT}/api/`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
// Start the server
startServer();