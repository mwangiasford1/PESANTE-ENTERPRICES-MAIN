require('dotenv').config();

module.exports = {
  development: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/pesante_db',
    options: {
      // Mongoose auto-handles parsing and topology in v7+
      dbName: 'pesante_db',
    },
  },
  production: {
    uri: process.env.MONGO_URI,
    options: {
      ssl: true,
      tlsAllowInvalidCertificates: true, // similar to rejectUnauthorized: false
      dbName: 'pesante_db',
    },
  },
};
