const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
  status: { type: String, enum: ['planned', 'active', 'completed', 'cancelled'], default: 'planned' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  budget: { type: Number, required: true },
  materials: [{
    name: String,
    quantity: Number,
    unit_cost: Number,
    total_cost: Number,
    supplier: String
  }],
  schedule: [{
    task: String,
    start_date: Date,
    end_date: Date,
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);