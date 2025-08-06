const Order = require("../models/Order");
const Service = require("../models/Service");

exports.createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;
    const gig = await Service.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.seller.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot purchase your own gig." });
    }
    const order = new Order({
      buyerId: req.user.id,
      sellerId: gig.seller,
      serviceId: gigId,
      amount: gig.price,
      status: "pending",
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    })
      .populate("serviceId")
      .populate("buyerId", "username email")
      .populate("sellerId", "username email");
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("serviceId")
      .populate("buyerId", "username email")
      .populate("sellerId", "username email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.buyerId._id.toString() !== req.user.id &&
      order.sellerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

exports.markCompleted = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order marked as completed", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};
