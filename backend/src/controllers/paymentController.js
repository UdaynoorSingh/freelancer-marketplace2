const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, gigId, gigTitle, sellerId } = req.body;

    if (!amount || !gigId || !gigTitle || !sellerId) {
      return res.status(400).json({
        message: "Missing required fields: amount, gigId, gigTitle, sellerId",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      metadata: {
        gigId,
        gigTitle,
        buyerId: req.user.id,
        sellerId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, gigId } = req.body;

    if (!paymentIntentId || !gigId) {
      return res.status(400).json({
        message: "Missing required fields: paymentIntentId, gigId",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment not completed successfully",
      });
    }

    const Order = require("../models/Order");
    const Service = require("../models/Service");

    const gig = await Service.findById(gigId).populate(
      "seller",
      "username email"
    );
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const order = new Order({
      buyerId: req.user.id,
      sellerId: gig.seller._id,
      serviceId: gigId,
      amount: paymentIntent.amount / 100,
      status: "pending",
      paymentIntentId: paymentIntentId,
      paymentStatus: "completed",
    });

    await order.save();

    res.json({
      message: "Payment confirmed and order created successfully",
      order: {
        id: order._id,
        amount: order.amount,
        status: order.status,
        gigTitle: gig.title,
      },
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({
      message: "Failed to get payment status",
      error: error.message,
    });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
