// index.js - EXPRESS 4.x COMPATIBLE VERSION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

console.log("🌱 Starting Pesante Backend Server...");
console.log("🔧 Environment:", process.env.NODE_ENV || 'development');
console.log("🔌 Port:", PORT);

// Middleware setup
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from your frontend URLs or no origin (mobile apps, etc.)
    const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5174', 'http://localhost:4000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
let db;

async function connectToMongoDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    db = client.db();
    
    // Test connection
    await db.admin().ping();
    console.log("💓 Database ping successful");
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Available collections:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("💥 MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Authentication middleware
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

// Validation helpers
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

// ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected',
    version: '2.0.0',
    express: '4.x'
  });
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    console.log(`🔑 Login attempt for user: ${username}`);
    
    // Use environment variables for credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'pesante254';
    
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log("✅ Login successful");
      res.json({ 
        success: true, 
        message: "Login successful",
        token,
        expiresIn: '24h'
      });
    } else {
      console.log("❌ Login failed: Invalid credentials");
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    console.log("📋 Fetching properties...");
    const properties = await db.collection("properties").find({}).sort({ created_at: -1 }).toArray();
    console.log(`📊 Found ${properties.length} properties`);
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

app.get('/api/properties/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🏠 Fetching property: ${id}`);
    
    const property = await db.collection("properties").findOne({ _id: new ObjectId(id) });
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

app.post('/api/properties', 
  authenticateToken, 
  validateRequired(['title', 'location', 'type', 'price']), 
  async (req, res) => {
    try {
      console.log("➕ Creating new property:", req.body.title);
      
      // Validate property type
      const validTypes = ['Residential', 'Commercial', 'Land'];
      if (!validTypes.includes(req.body.type)) {
        return res.status(400).json({ error: 'Invalid property type. Must be: Residential, Commercial, or Land' });
      }
      
      // Validate price
      if (req.body.price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }
      
      const propertyData = {
        ...req.body,
        price: parseFloat(req.body.price),
        bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : null,
        bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : null,
        area: req.body.area ? parseFloat(req.body.area) : null,
        created_at: new Date(),
        updated_at: new Date(),
        status: req.body.status || 'Active'
      };
      
      const result = await db.collection("properties").insertOne(propertyData);
      
      console.log("✅ Property created with ID:", result.insertedId);
      res.status(201).json({ 
        success: true, 
        id: result.insertedId,
        message: 'Property created successfully'
      });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: "Failed to create property" });
    }
  }
);

app.put('/api/properties/:id',
  authenticateToken,
  validateObjectId,
  validateRequired(['title', 'location', 'type', 'price']),
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`✏️ Updating property: ${id}`);
      
      const updateData = {
        ...req.body,
        price: parseFloat(req.body.price),
        bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : null,
        bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : null,
        area: req.body.area ? parseFloat(req.body.area) : null,
        updated_at: new Date()
      };
      
      const result = await db.collection("properties").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      console.log("✅ Property updated successfully");
      res.json({ success: true, message: 'Property updated successfully' });
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ error: "Failed to update property" });
    }
  }
);

app.delete('/api/properties/:id', authenticateToken, validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting property: ${id}`);
    
    const result = await db.collection("properties").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    console.log("✅ Property deleted successfully");
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// Appointments routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    console.log("📅 Fetching appointments...");
    const appointments = await db.collection("appointments")
      .find({})
      .sort({ datetime: 1 })
      .toArray();
    
    console.log(`📊 Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

app.post('/api/appointments', 
  validateRequired(['name', 'datetime']), 
  async (req, res) => {
    try {
      console.log("📅 Creating appointment for:", req.body.name);
      
      // Validate datetime
      const appointmentDate = new Date(req.body.datetime);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid datetime format' });
      }
      
      const appointmentData = {
        ...req.body,
        datetime: appointmentDate,
        created_at: new Date(),
        status: 'pending'
      };
      
      const result = await db.collection("appointments").insertOne(appointmentData);
      
      console.log("✅ Appointment created with ID:", result.insertedId);
      res.status(201).json({ 
        success: true, 
        id: result.insertedId,
        message: 'Appointment scheduled successfully'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: "Failed to schedule appointment" });
    }
  }
);

// Inquiries routes
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    console.log("💬 Fetching inquiries...");
    const inquiries = await db.collection("inquiries")
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    console.log(`📊 Found ${inquiries.length} inquiries`);
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.post('/api/inquiries', 
  validateRequired(['name', 'message']), 
  async (req, res) => {
    try {
      console.log("💬 Creating inquiry from:", req.body.name);
      
      const inquiryData = {
        ...req.body,
        created_at: new Date(),
        status: 'new'
      };
      
      const result = await db.collection("inquiries").insertOne(inquiryData);
      
      console.log("✅ Inquiry created with ID:", result.insertedId);
      res.status(201).json({ 
        success: true, 
        id: result.insertedId,
        message: 'Inquiry submitted successfully'
      });
    } catch (error) {
      console.error('Error creating inquiry:', error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  }
);

// Legacy compatibility route
app.get('/api/test-insert', async (req, res) => {
  try {
    const result = await db.collection("contacts").insertOne({
      name: "Test Entry " + new Date().toISOString(),
      email: "test@example.com",
      created_at: new Date()
    });
    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for unmatched routes
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
      console.log("✨ Pesante Backend is ready!");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();