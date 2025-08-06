const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const auth = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/search", serviceController.searchServices);

router.get("/my-gigs", auth, serviceController.getMyGigs);

router.get("/:id", serviceController.getService);

router.post(
  "/",
  auth,
  upload.array("images", 5),
  serviceController.createService
);

router.put(
  "/:id",
  auth,
  upload.array("images", 5),
  serviceController.updateService
);

router.delete("/:id", auth, serviceController.deleteService);

module.exports = router;
