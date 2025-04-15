const reviewModel = require('../models/review-model');

async function buildVehicleDetails(req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await reviewModel.getVehicleById(vehicleId);
    const reviews = await reviewModel.getReviewsByVehicle(vehicleId);

    res.render("inventory/vehicle", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      reviews,
      nav: res.locals.nav,
      accountData: res.locals.accountData,
      errors: null
    });
  } catch (error) {const reviewModel = require('../models/review-model');

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
    
        // Save review
        await reviewModel.insertReview({ review_text, inv_id, account_id });
    
        req.flash("success", "Review submitted successfully.");
        res.redirect(`/inv/detail/${inv_id}`); // ✅ Redirects back to correct vehicle page
      } catch (error) {
        console.error("Error submitting review:", error.message);
        next(error);
      }
    }
    
    module.exports = {
      submitReview
    };
    
    next(error);
  }
}

async function submitReview(req, res, next) {
  try {
    const { review_text, inv_id, account_id } = req.body;
    await reviewModel.insertReview({ review_text, inv_id, account_id });
    req.flash("success", "Review submitted successfully.");
    res.redirect(`/review/vehicles/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetails,
  submitReview
};
