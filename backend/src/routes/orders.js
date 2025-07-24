const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// Create order
router.post('/', auth, orderController.createOrder);
// Get all orders for current user (buyer or seller)
router.get('/', auth, orderController.getOrders);
// Get single order by id
router.get('/:id', auth, orderController.getOrder);
router.patch('/:id/complete', auth, admin, orderController.markCompleted);

module.exports = router; 