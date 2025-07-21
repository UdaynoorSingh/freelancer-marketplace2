const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

// Send message
router.post('/', auth, messageController.sendMessage);
// Get messages between current user and another user
router.get('/:userId', auth, messageController.getMessagesBetweenUsers);

module.exports = router; 