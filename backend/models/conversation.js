const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  messages: [directMessageSchema],
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Ensure participants array is always sorted to maintain consistent conversation lookup
conversationSchema.pre('save', function(next) {
  this.participants.sort();
  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;