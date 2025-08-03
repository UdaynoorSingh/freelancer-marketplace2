const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

// Create payment intent
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

// Confirm payment and create order
router.post('/confirm-payment', auth, paymentController.confirmPayment);

// Get payment status
router.get('/status/:paymentIntentId', auth, paymentController.getPaymentStatus);

// Webhook endpoint (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 