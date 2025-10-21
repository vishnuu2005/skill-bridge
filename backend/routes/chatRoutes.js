const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middleware/auth');

// All chat routes require authentication
router.use(protect);

// Initialize or get a chat for a specific job
router.post('/initialize', chatController.initializeChat);

// Get all chats for the current user
router.get('/', chatController.getUserChats);

// Get a specific chat with messages
router.get('/:chatId', chatController.getChatById);

// Send a message in a chat
router.post('/:chatId/message', chatController.sendMessage);

// Delete a chat
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;
