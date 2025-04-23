const Review = require("../models/reviews.model");

// ➕ Add review
exports.addReview = async (req, res) => {
  try {
    const { cafe_id, user_id, rating, comment } = req.body;

    // Optional validation: If the necessary fields are not provided, return an error.
    if (!cafe_id || !user_id || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add the review to the database
    const review = await Review.create({
      cafe_id,
      user_id,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review: {
        review_id: review.review_id, // Explicit column names
        cafe_id: review.cafe_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        updated_at: review.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    // If there are no reviews, return an empty array
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    // Return only relevant columns (like we did for addReview)
    const formattedReviews = reviews.map((review) => ({
      review_id: review.review_id,
      cafe_id: review.cafe_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update review
exports.updateReview = async (req, res) => {
  try {
    const { review_id, rating, comment } = req.body;

    // Validation to ensure all necessary fields are provided
    if (!review_id || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update review with new data
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Return the updated review with relevant columns
    res.json({
      message: "Review updated successfully",
      review: {
        review_id: review.review_id,
        cafe_id: review.cafe_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        updated_at: review.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.body;

    if (!review_id) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    const review = await Review.findOne({
      where: { review_id, is_deleted: false },
    });

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or already deleted" });
    }

    await review.update({ is_deleted: true });
    res.json({ message: "Review deleted (soft delete) successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
