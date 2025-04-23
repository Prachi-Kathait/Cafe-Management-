const express = require("express");
const paymentRouter = express.Router();

const {
  addPayment,
  updatePaymentStatus,
  getAllPayments, // ✅ Add this here
} = require("../controllers/payments.controller");

paymentRouter.post("/newPayment", addPayment); // ➕ Add
paymentRouter.get("/getPayments", getAllPayments); // 🔍 Get All Payments
paymentRouter.patch("/status", updatePaymentStatus); // 🔄 Update status

module.exports = paymentRouter;
