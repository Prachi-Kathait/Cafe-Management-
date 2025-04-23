const express = require("express");
const orderItemsRouter = express.Router();
const {
  addOrderItems,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
} = require("../controllers/order_items.controller");

// ➕ Add items to order
orderItemsRouter.post("/", addOrderItems);

// 📦 Get items by order ID
orderItemsRouter.get("/:orderId", getOrderItemsByOrderId);

// ✏️ Update an item in the order
orderItemsRouter.put("/:id", updateOrderItem);

// ❌ Delete an item from the order
orderItemsRouter.delete("/:id", deleteOrderItem);

module.exports = orderItemsRouter;
