const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Residential', 'Commercial', 'Land'],
    required: true
  },
  price: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number },
  image: { type: String }, // You can use Buffer or base64 if needed for long-form images
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Pending'],
    default: 'Active'
  },
  contactPhone: { type: String },
  contactEmail: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
