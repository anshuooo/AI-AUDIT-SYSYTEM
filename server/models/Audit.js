const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  // Stores the full results object or the tools breakdown
  toolsData: {
    type: Object,
    required: [true, 'Tools data is required'],
    default: {}
  },
  // Maps to totalMonthlySavings from frontend
  totalSavings: {
    type: Number,
    required: [true, 'Total monthly savings is required'],
    default: 0
  },
  // Maps to totalYearlySavings from frontend
  yearlySavings: {
    type: Number,
    default: 0
  },
  // Stores the dynamic or fallback AI summary
  aiSummary: {
    type: String,
    default: 'AI summary not available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Audit', AuditSchema);
