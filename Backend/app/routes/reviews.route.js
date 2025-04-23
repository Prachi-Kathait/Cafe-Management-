const express = require("express");
const reviewRouter = express.Router();

const {
  addReview,
  getAllReviews, // This API will fetch all reviews
  updateReview,
  deleteReview,
} = require("../controllers/reviews.controller");

reviewRouter.post("/new", addReview); // ➕ Add review

// Only 1 GET API to get all reviews
reviewRouter.get("/", getAllReviews); // 🔍 Get All Reviews

reviewRouter.put("/update", updateReview); // ✏️ Update review
reviewRouter.put("/delete", deleteReview); // ❌ Delete review

module.exports = reviewRouter;
