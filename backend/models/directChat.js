const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});

const directChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  participantNames: [{ type: String }],
  messages: [directMessageSchema],
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create compound index for efficient querying
directChatSchema.index({ participants: 1 });
directChatSchema.index({ lastMessageTime: -1 });

// Method to get unread count for a specific user
directChatSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

// Method to increment unread count for a user
directChatSchema.methods.incrementUnread = function(userId) {
  const count = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), count + 1);
};

// Method to reset unread count for a user
directChatSchema.methods.resetUnread = function(userId) {
  this.unreadCount.set(userId.toString(), 0);
};

module.exports = mongoose.model('DirectChat', directChatSchema);
