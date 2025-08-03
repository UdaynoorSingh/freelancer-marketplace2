const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fiverr_clone';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room for user
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        }
    });

    // Forward chat messages
    socket.on('chat:send', ({ sender, receiver, content, gig }) => {
        try {
            console.log('Message from', sender, 'to', receiver, ':', content);
            // Emit to receiver's room
            io.to(receiver).emit('chat:receive', {
                sender,
                content,
                timestamp: new Date(),
                gig
            });
        } catch (error) {
            console.error('Socket error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = io; 