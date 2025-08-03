const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, content, gig } = req.body;
        if (!receiver || !content) return res.status(400).json({ message: 'Receiver and content required' });
        const message = new Message({ sender: req.user.id, receiver, content, gig });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Error sending message', error: err.message });
    }
};

exports.getMessagesBetweenUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort({ timestamp: 1 }).populate('gig', 'title');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        console.log('getConversations called for user:', req.user.id);

        // Get all messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        }).sort({ timestamp: -1 }).populate('sender', 'username').populate('receiver', 'username');

        console.log('Found messages:', messages.length);

        // Group messages by conversation (other user)
        const conversations = {};

        messages.forEach(message => {
            // Skip messages where sender or receiver is null (deleted users)
            if (!message.sender || !message.receiver) {
                console.log('Skipping message with null sender or receiver:', message._id);
                return;
            }

            const otherUserId = message.sender._id.toString() === req.user.id
                ? message.receiver._id.toString()
                : message.sender._id.toString();

            const otherUser = message.sender._id.toString() === req.user.id
                ? message.receiver
                : message.sender;

            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    otherUser: {
                        _id: otherUser._id,
                        username: otherUser.username
                    },
                    lastMessage: null,
                    unreadCount: 0
                };
            }

            // Set last message if not already set (since messages are sorted by timestamp desc)
            if (!conversations[otherUserId].lastMessage) {
                conversations[otherUserId].lastMessage = {
                    content: message.content,
                    timestamp: message.timestamp
                };
            }

            // Count unread messages (messages sent to current user that they haven't seen)
            if (message.receiver && message.receiver._id.toString() === req.user.id) {
                conversations[otherUserId].unreadCount++;
            }
        });

        // Convert to array and sort by last message timestamp
        const conversationsArray = Object.values(conversations).sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        });

        console.log('Returning conversations:', conversationsArray.length);
        res.json(conversationsArray);
    } catch (err) {
        console.error('Error in getConversations:', err);
        res.status(500).json({ message: 'Error fetching conversations', error: err.message });
    }
}; 