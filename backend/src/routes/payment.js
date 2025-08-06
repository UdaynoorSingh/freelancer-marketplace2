const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

router.post('/confirm-payment', auth, paymentController.confirmPayment);

router.get('/status/:paymentIntentId', auth, paymentController.getPaymentStatus);

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 