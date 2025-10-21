const express = require('express');
const router = express.Router();
const directChatController = require('../controllers/directChatController');
const protect = require('../middleware/auth');

// All direct chat routes require authentication
router.use(protect);

// Initialize or get a direct chat with another user
router.post('/initialize', directChatController.initializeDirectChat);

// Get all direct chats for the current user
router.get('/', directChatController.getUserDirectChats);

// Get a specific direct chat with messages
router.get('/:chatId', directChatController.getDirectChatById);

// Send a message in a direct chat
router.post('/:chatId/message', directChatController.sendDirectMessage);

// Delete a direct chat
router.delete('/:chatId', directChatController.deleteDirectChat);

module.exports = router;
