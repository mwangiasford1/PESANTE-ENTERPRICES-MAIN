const mongoose = require('mongoose');

const landTitleSchema = new mongoose.Schema({
  title_number: { type: String, required: true, unique: true },
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  owner_name: { type: String, required: true },
  land_size: { type: Number, required: true },
  location: { type: String, required: true },
  title_deed: { type: String }, // Base64 encoded document
  survey_plan: { type: String }, // Base64 encoded document
  valuation_report: { type: String }, // Base64 encoded document
  status: { type: String, enum: ['active', 'pending', 'disputed', 'transferred'], default: 'active' },
  registration_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LandTitle', landTitleSchema);