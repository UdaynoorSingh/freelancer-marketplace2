const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middlewares/auth");

router.post("/", auth, messageController.sendMessage);
router.get("/conversations", auth, messageController.getConversations);
router.get("/:userId", auth, messageController.getMessagesBetweenUsers);

module.exports = router;
