// index.js
const express = require("express");
const app = express();
const sequelize = require("./app/config/db.config");
const userRouter = require("./app/routes/users.route");
const adminRouter = require("./app/routes/admins.route");
const cafeRouter = require("./app/routes/cafes.route");
const menuItemsRouter = require("./app/routes/menu_items.route");
const orderRouter = require("./app/routes/orders.route");
const orderItemsRouter = require("./app/routes/order_items.route");
const paymentRouter = require("./app/routes/payments.route");
const reviewRouter = require("./app/routes/reviews.route");

require("dotenv").config();
const config = process.env;
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cafe", cafeRouter);
app.use("/api/menu-items", menuItemsRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-items", orderItemsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);

// Connect and Start
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL database.");
    app.listen(config.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to DB:", err);
  });
