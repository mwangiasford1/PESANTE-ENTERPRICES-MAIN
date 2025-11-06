const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  permit_type: { type: String, required: true },
  permit_number: { type: String, required: true },
  issuing_authority: { type: String, required: true },
  issue_date: { type: Date, required: true },
  expiry_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'pending', 'rejected'], default: 'pending' },
  document: { type: String }, // Base64 encoded permit document
  renewal_reminder: { type: Date },
  compliance_notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compliance', complianceSchema);