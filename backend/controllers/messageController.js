const Conversation = require('../models/conversation');
const User = require('../models/user');

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name avatar')
      .sort({ lastMessageTime: -1 });

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== userId);
      return {
        id: conv._id,
        otherUser: otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCount.get(userId.toString()) || 0
      };
    });

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

// Get messages for a specific conversation
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name avatar');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    // Mark messages as read
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    res.json(conversation.messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Find or create conversation
    const participants = [senderId, receiverId].sort();
    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        messages: []
      });
    }

    // Add message
    const message = {
      sender: senderId,
      content,
      timestamp: new Date()
    };
    conversation.messages.push(message);
    conversation.lastMessage = content;
    conversation.lastMessageTime = message.timestamp;

    // Update unread count for receiver
    const currentUnreadCount = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnreadCount + 1);

    await conversation.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Search users for new conversation
const searchUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: userId },
      name: { $regex: query, $options: 'i' }
    })
    .select('name avatar')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  searchUsers
};