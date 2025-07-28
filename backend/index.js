// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;
// 🌱 Log environment variables
console.log("🌱 Current .env values:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
});
// 🛡️ Middleware setup
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:4000'],
  credentials: true
}));
app.use(express.json());
// 🔌 MongoDB connection setup
let db; // Global variable to hold the database instance
async function connectToMongoDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    db = client.db(); // Uses DB from URI
    // 📥 Sample document insertion for testing
    const result = await db.collection("contacts").insertOne({
      name: "Test Entry",
      email: "test@example.com",
      created_at: new Date()
    });
    console.log("📥 Inserted sample document:", result.insertedId);
    // 📂 List collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections in DB:", collections.map(c => c.name));
  } catch (err) {
    console.error("💥 MongoDB connection error:", err);
  }
}
connectToMongoDB();
// 🔐 Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`🔑 Login attempt: ${username}`);
  // ⚙️ Hardcoded login logic
  if (username === "admin" && password === "pesante254") {
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});
// 🚀 API Routing endpoints
// --- Properties Routes ---
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.collection("properties").find().toArray();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});
app.post('/api/properties', async (req, res) => {
  try {
    const result = await db.collection("properties").insertOne(req.body);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Failed to add property" });
  }
});
// --- Appointments Routes ---
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await db.collection("appointments").find().toArray();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
app.post('/api/appointments', async (req, res) => {
  try {
    const result = await db.collection("appointments").insertOne(req.body);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});
// --- Inquiries Routes ---
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await db.collection("inquiries").find().toArray();
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});
app.post('/api/inquiries', async (req, res) => {
  try {
    const result = await db.collection("inquiries").insertOne(req.body);
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Failed to create inquiry" });
  }
});
// 🚀 Server startup
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});