const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const OrderItem = require("../models/order_items.model");

// ➕ Add multiple order items
exports.addOrderItems = async (req, res) => {
  try {
    const items = req.body.items; // array of { order_id, item_id, quantity, price }
    const created = await OrderItem.bulkCreate(items);
    res
      .status(201)
      .json({ message: "Order items added successfully", data: created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📦 Get items by order ID
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const items = await OrderItem.findAll({ where: { order_id: orderId } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update order item
exports.updateOrderItem = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await OrderItem.update(req.body, {
      where: { order_item_id: id },
    });
    if (updated[0] === 1) {
      res.status(200).json({ message: "Order item updated successfully" });
    } else {
      res.status(404).json({ message: "Order item not found or no changes" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete order item
exports.deleteOrderItem = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await OrderItem.destroy({ where: { order_item_id: id } });
    if (deleted) {
      res.status(200).json({ message: "Order item deleted successfully" });
    } else {
      res.status(404).json({ message: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
