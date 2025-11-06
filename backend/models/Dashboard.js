const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  metrics: {
    occupancy_rate: { type: Number, default: 0 },
    monthly_revenue: { type: Number, default: 0 },
    maintenance_requests: { type: Number, default: 0 },
    tenant_satisfaction: { type: Number, default: 0 }
  },
  alerts: [{
    type: { type: String, enum: ['maintenance', 'payment', 'lease', 'compliance'] },
    message: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dashboard', dashboardSchema);