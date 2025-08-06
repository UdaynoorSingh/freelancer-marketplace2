const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const User = require("../models/User");
const Service = require("../models/Service");
const Review = require("../models/Review");
const Order = require("../models/Order");

router.get("/users", auth, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).select("-password -verificationToken");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

router.delete("/users/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
});

router.get("/gigs", auth, adminMiddleware, async (req, res) => {
  try {
    const gigs = await Service.find({}).populate("seller", "username email");
    res.json(gigs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching gigs", error: err.message });
  }
});

router.delete("/gigs/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const gig = await Service.findByIdAndDelete(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.json({ message: "Gig deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting gig", error: err.message });
  }
});

router.get("/reviews", auth, adminMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "username email")
      .populate("gigId", "title");
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

router.delete("/reviews/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
});

router.get("/orders", auth, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("buyerId", "username email")
      .populate("sellerId", "username email")
      .populate("gigId", "title");
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
});

router.patch(
  "/orders/:id/complete",
  auth,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "completed" },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order marked as completed", order });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating order", error: err.message });
    }
  }
);

module.exports = router;
