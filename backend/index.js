require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

// 🌱 Log environment variables
console.log("🌱 Current .env values:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true
}));
app.use(express.json());

// MongoDB connection
async function connectToMongoDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(uri);

    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db(); // Uses the default DB from URI

    // 📥 Insert a sample document into 'contacts' collection
    const result = await db.collection("contacts").insertOne({
      name: "Test Entry",
      email: "test@example.com",
      created_at: new Date()
    });

    console.log("📥 Document inserted with ID:", result.insertedId);

    // 📂 List current collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections in DB:", collections.map(c => c.name));
  } catch (err) {
    console.error("💥 MongoDB connection error:", err);
  }
}
connectToMongoDB();

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Received data: Username: ${username}, Password: ${password}`);

  // Simple hardcoded login logic
  if (username === "admin" && password === "pesante254") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failed. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
