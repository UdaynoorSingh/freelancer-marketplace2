const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        // Create user
        const user = new User({ username, email, password: hashedPassword, verificationToken });
        await user.save();
        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailErr) {
            console.error('Email sending error:', emailErr);
            return res.status(500).json({ message: 'Registration failed: could not send verification email', error: emailErr.message });
        }
        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send('Invalid or expired verification link.');
        }
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        // Redirect to login page
        res.redirect(`${process.env.CLIENT_URL}/login`);
    } catch (err) {
        console.error('Email verification error:', err);
        res.status(500).send('Server error');
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        // Check if username is taken
        const existing = await User.findOne({ username });
        if (existing && existing._id.toString() !== req.user.id) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { username },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Username updated', username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Error updating username', error: err.message });
    }
}; 