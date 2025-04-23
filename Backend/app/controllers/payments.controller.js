const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const Payment = require("../models/payments.model");

// ➕ Add Payment (Manual Field Entry)
exports.addPayment = async (req, res) => {
  try {
    const {
      order_id,
      user_id,
      amount,
      payment_method,
      payment_status,
      payment_time, // Make sure this is part of req.body or defaults to current date
    } = req.body;

    // Optional validation
    if (
      !order_id ||
      !user_id ||
      !amount ||
      !payment_method ||
      !payment_status
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Create payment entry with current date fallback if payment_time is not provided
    const data = await Payment.create({
      order_id,
      user_id,
      amount,
      payment_method,
      payment_status,
      payment_time: payment_time || new Date(), // Default to current date
    });

    res.status(201).json({
      message: "Payment added successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const data = await Payment.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Update Payment Status
// payments.controller.js
exports.updatePaymentStatus = async (req, res) => {
  try {
    // Get payment_id and updated payment_status from request body
    const { payment_id, payment_status } = req.body;

    // Validate if both payment_id and payment_status are provided
    if (!payment_id || !payment_status) {
      return res.status(400).json({
        error: "payment_id and payment_status are required",
      });
    }

    // Find the payment by the provided payment_id
    const data = await Payment.findByPk(payment_id);

    // If the payment does not exist, return an error
    if (!data) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update the payment status
    data.payment_status = payment_status;
    await data.save();

    // Return the updated payment data as a response
    res.json({
      message: "Payment status updated successfully",
      data: {
        payment_id: data.payment_id,
        order_id: data.order_id,
        user_id: data.user_id,
        amount: data.amount,
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        payment_time: data.payment_time,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
