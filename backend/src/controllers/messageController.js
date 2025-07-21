const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, content } = req.body;
        if (!receiver || !content) return res.status(400).json({ message: 'Receiver and content required' });
        const message = new Message({ sender: req.user.id, receiver, content });
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
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
}; 