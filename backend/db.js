const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

// Environment Logs
if (env !== 'production') {
  console.log("NODE_ENV:", env);
  console.log("Connecting to MongoDB at:", config.uri);
}

// Connection Handler
mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log(`MongoDB connected successfully (${env} mode)`);
  })
  .catch((err) => {
    console.error(`MongoDB connection error:`, err.message);
    process.exit(1);
  });

// Connection Events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose;
