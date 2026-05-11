const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  companyName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  teamSize: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
