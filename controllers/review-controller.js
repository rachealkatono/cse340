const reviewModel = require('../models/review-model');

/**
 * Handle POST submission of a review
 */
async function submitReview(req, res, next) {
  try {
    const { review_text, inv_id, account_id } = req.body;

    // Basic validation
    if (!review_text || !inv_id || !account_id) {
      req.flash("error", "All review fields are required.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // Save review to the database
    await reviewModel.insertReview({ review_text, inv_id, account_id });

    req.flash("success", "Review submitted successfully.");
    res.redirect(`/inv/detail/${inv_id}`); // ✅ Redirects to correct vehicle page
  } catch (error) {
    console.error("Error submitting review:", error.message);
    next(error);
  }
}

module.exports = {
  submitReview
};
