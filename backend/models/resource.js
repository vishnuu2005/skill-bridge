const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Course', 'Workshop', 'Program', 'Other'], default: 'Course' },
  skillsCovered: [{ type: String }],
  provider: { type: String },
  url: { type: String },
  village: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
