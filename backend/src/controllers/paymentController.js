const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, gigId, gigTitle, sellerId } = req.body;

        if (!amount || !gigId || !gigTitle || !sellerId) {
            return res.status(400).json({
                message: 'Missing required fields: amount, gigId, gigTitle, sellerId'
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise (smallest unit of INR)
            currency: 'inr',
            metadata: {
                gigId,
                gigTitle,
                buyerId: req.user.id,
                sellerId
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
};

// Confirm payment and create order
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, gigId } = req.body;

        if (!paymentIntentId || !gigId) {
            return res.status(400).json({
                message: 'Missing required fields: paymentIntentId, gigId'
            });
        }

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                message: 'Payment not completed successfully'
            });
        }

        // Import Order model
        const Order = require('../models/Order');
        const Service = require('../models/Service');

        // Get gig details
        const gig = await Service.findById(gigId).populate('seller', 'username email');
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Create order
        const order = new Order({
            buyerId: req.user.id,
            sellerId: gig.seller._id,
            serviceId: gigId,
            amount: paymentIntent.amount / 100, // Convert from paise to rupees
            status: 'pending',
            paymentIntentId: paymentIntentId,
            paymentStatus: 'completed'
        });

        await order.save();

        res.json({
            message: 'Payment confirmed and order created successfully',
            order: {
                id: order._id,
                amount: order.amount,
                status: order.status,
                gigTitle: gig.title
            }
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            message: 'Failed to confirm payment',
            error: error.message
        });
    }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert from paise to rupees
            currency: paymentIntent.currency
        });

    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({
            message: 'Failed to get payment status',
            error: error.message
        });
    }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // You can add additional logic here like updating order status
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}; 