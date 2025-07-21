const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const auth = require('../middlewares/auth');

// Register
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Email verification
router.get('/verify-email', authController.verifyEmail);

router.put('/update-username', auth, authController.updateUsername);

module.exports = router; 