const Chat = require('../models/chat');
const Job = require('../models/job');
const User = require('../models/user');

// Initialize or get a chat for a job between applicant and job poster
exports.initializeChat = async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user.id;

    const job = await Job.findById(jobId).populate('postedBy');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy._id.toString() === applicantId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    const applicant = await User.findById(applicantId);

    // Check if chat already exists
    let chat = await Chat.findOne({
      job: jobId,
      jobPoster: job.postedBy._id,
      applicant: applicantId
    });

    if (!chat) {
      // Create new chat
      chat = new Chat({
        job: jobId,
        jobTitle: job.title,
        jobPoster: job.postedBy._id,
        jobPosterName: job.postedBy.name,
        jobPosterPhone: job.postedBy.phone,
        applicant: applicantId,
        applicantName: applicant.name,
        applicantPhone: applicant.phone,
        messages: []
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chats for the current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      $or: [{ jobPoster: userId }, { applicant: userId }],
      isActive: true
    })
      .populate('job')
      .populate('jobPoster', 'name phone email')
      .populate('applicant', 'name phone email')
      .sort({ lastMessageTime: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific chat with messages
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId)
      .populate('job')
      .populate('jobPoster', 'name phone email')
      .populate('applicant', 'name phone email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.jobPoster._id.toString() !== userId && chat.applicant._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    // Mark messages as read
    const isJobPoster = chat.jobPoster._id.toString() === userId;
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== userId) {
        msg.isRead = true;
      }
    });

    // Reset unread count for the current user
    if (isJobPoster) {
      chat.unreadCount.jobPoster = 0;
    } else {
      chat.unreadCount.applicant = 0;
    }

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.jobPoster.toString() !== userId && chat.applicant.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    const user = await User.findById(userId);
    const isJobPoster = chat.jobPoster.toString() === userId;

    // Add message with admin status
    const newMessage = {
      sender: userId,
      senderName: user.name,
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
      isAdmin: user.isAdmin || false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content.trim();
    chat.lastMessageTime = new Date();

    // Increment unread count for the recipient
    if (isJobPoster) {
      chat.unreadCount.applicant += 1;
    } else {
      chat.unreadCount.jobPoster += 1;
    }

    await chat.save();

    // Populate the chat for response
    await chat.populate('jobPoster', 'name phone email');
    await chat.populate('applicant', 'name phone email');

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.jobPoster.toString() !== userId && chat.applicant.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this chat' });
    }

    chat.isActive = false;
    await chat.save();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
