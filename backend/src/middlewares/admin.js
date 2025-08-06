const User = require("../models/User");

module.exports = async (req, res, next) => {
  console.log(
    "Admin middleware check:",
    req.user,
    "Admin:",
    process.env.ADMIN_EMAIL
  );

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.email === process.env.ADMIN_EMAIL) {
      req.user = user;
      return next();
    }

    return res.status(403).json({ message: "Admin access required." });
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
