const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobTitle: { type: String, required: true },
  jobPoster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobPosterName: { type: String },
  jobPosterPhone: { type: String },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: { type: String },
  applicantPhone: { type: String },
  messages: [messageSchema],
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now },
  unreadCount: {
    jobPoster: { type: Number, default: 0 },
    applicant: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create compound index for efficient querying
chatSchema.index({ job: 1, jobPoster: 1, applicant: 1 }, { unique: true });
chatSchema.index({ jobPoster: 1 });
chatSchema.index({ applicant: 1 });
chatSchema.index({ lastMessageTime: -1 });

module.exports = mongoose.model('Chat', chatSchema);
