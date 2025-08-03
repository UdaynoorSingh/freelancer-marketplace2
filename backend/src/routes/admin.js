const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/admin');
const User = require('../models/User');

// Get all users (admin only)
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({}).select('-password -verificationToken');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Delete user (admin only)
router.delete('/users/:id', adminMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router; 