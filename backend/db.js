const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

// Verbose logging to verify config loading
console.log("🔍 NODE_ENV:", env);
console.log("🔗 Connecting to MongoDB at:", config.uri);

mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log(`✅ MongoDB connected successfully in ${env} mode`);
  })
  .catch((err) => {
    console.error(`❌ MongoDB connection error:`, err.message);
    process.exit(1); // Force exit on failure
  });

module.exports = mongoose;
