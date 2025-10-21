const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  village: { type: String },
  salary: { type: String },
  phone: { type: String },
  positions: { type: Number, default: 1, min: 1 },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  postedByName: { type: String },
  postedByPhone: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
