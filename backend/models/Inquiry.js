const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  contactEmail: { type: String }, // Optional contact field
  status: {
    type: String,
    enum: ['new', 'reviewed', 'archived'],
    default: 'new'
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
