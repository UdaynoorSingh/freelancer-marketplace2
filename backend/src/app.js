const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "https://freelancer-marketplace2.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
const ordersRouter = require("./routes/orders");
app.use("/api/orders", ordersRouter);
const messagesRouter = require("./routes/messages");
app.use("/api/messages", messagesRouter);
const reviewsRouter = require("./routes/reviews");
app.use("/api/reviews", reviewsRouter);
const favoritesRouter = require("./routes/favorites");
app.use("/api/favorites", favoritesRouter);
const adminRouter = require("./routes/admin");
app.use("/api/admin", adminRouter);
const paymentRouter = require("./routes/payment");
app.use("/api/payment", paymentRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

module.exports = app;
