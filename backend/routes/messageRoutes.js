const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, searchUsers } = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all conversations
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', getMessages);

// Send a message
router.post('/send', sendMessage);

// Search users for new conversation
router.get('/users/search', searchUsers);

module.exports = router;