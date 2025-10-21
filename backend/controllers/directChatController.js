const DirectChat = require('../models/directChat');
const User = require('../models/user');

// Initialize or get a direct chat between two users
exports.initializeDirectChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === senderId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Get both users
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Check if chat already exists between these users
    let chat = await DirectChat.findOne({
      participants: { $all: [senderId, recipientId] }
    }).populate('participants', 'name email phone fullName');

    if (!chat) {
      // Create new direct chat
      chat = new DirectChat({
        participants: [senderId, recipientId],
        participantNames: [sender.name || sender.fullName, recipient.name || recipient.fullName],
        messages: [],
        unreadCount: new Map([
          [senderId.toString(), 0],
          [recipientId.toString(), 0]
        ])
      });
      await chat.save();
      // Populate after save
      await chat.populate('participants', 'name email phone fullName');
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error initializing direct chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all direct chats for the current user
exports.getUserDirectChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await DirectChat.find({
      participants: userId,
      isActive: true
    })
      .populate('participants', 'name email phone fullName')
      .sort({ lastMessageTime: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching direct chats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific direct chat with messages
exports.getDirectChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await DirectChat.findById(chatId)
      .populate('participants', 'name email phone fullName');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    const isParticipant = chat.participants.some(p => p._id.toString() === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== userId) {
        msg.isRead = true;
      }
    });

    // Reset unread count for the current user
    chat.resetUnread(userId);

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching direct chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a message in a direct chat
exports.sendDirectMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await DirectChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    const isParticipant = chat.participants.some(p => p._id.toString() === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    const user = await User.findById(userId);

    // Add message
    const newMessage = {
      sender: userId,
      senderName: user.name || user.fullName,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
      isAdmin: user.isAdmin || false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content.trim();
    chat.lastMessageTime = new Date();

    // Increment unread count for all other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== userId) {
        chat.incrementUnread(participantId);
      }
    });

    await chat.save();

    // Populate the chat for response
    await chat.populate('participants', 'name email phone fullName');

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error sending direct message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a direct chat
exports.deleteDirectChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await DirectChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    const isParticipant = chat.participants.some(p => p._id.toString() === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    chat.isActive = false;
    await chat.save();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting direct chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
