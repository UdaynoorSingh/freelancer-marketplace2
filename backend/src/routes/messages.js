const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

// Send message
router.post('/', auth, messageController.sendMessage);
// Get all conversations for current user (must come before /:userId)
router.get('/conversations', auth, messageController.getConversations);
// Get messages between current user and another user
router.get('/:userId', auth, messageController.getMessagesBetweenUsers);

module.exports = router; 