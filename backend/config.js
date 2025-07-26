require('dotenv').config();

module.exports = {
  development: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/pesante_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  production: {
    uri: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true, // similar to rejectUnauthorized: false
    },
  },
};
