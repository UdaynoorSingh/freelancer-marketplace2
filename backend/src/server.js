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
    // Join room for user
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    // Forward chat messages
    socket.on('chat:send', ({ sender, receiver, content }) => {
        // Emit to receiver's room
        io.to(receiver).emit('chat:receive', { sender, content, timestamp: new Date() });
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