const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  specialization: [{ type: String }],
  rating: { type: Number, min: 1, max: 5, default: 5 },
  availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
  hourly_rate: { type: Number, required: true },
  projects_completed: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contractor', contractorSchema);