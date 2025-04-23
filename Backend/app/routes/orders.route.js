const express = require("express");
const orderRouter = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orders.controller");

orderRouter.post("/create", createOrder);
orderRouter.get("/getAll", getAllOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.patch("/updateStatus/:id", updateOrderStatus);

module.exports = orderRouter;
