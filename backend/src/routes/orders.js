const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

// Create order
router.post('/', auth, orderController.createOrder);
// Get all orders for current user (buyer or seller)
router.get('/', auth, orderController.getOrders);
// Get single order by id
router.get('/:id', auth, orderController.getOrder);

module.exports = router; 