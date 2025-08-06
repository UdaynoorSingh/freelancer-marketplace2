const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const auth = require("../middlewares/auth");

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.get("/verify-email", authController.verifyEmail);

router.put("/update-username", auth, authController.updateUsername);

router.get("/user/:id", async (req, res) => {
  try {
    const user = await require("../models/User")
      .findById(req.params.id)
      .select("_id username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

module.exports = router;
