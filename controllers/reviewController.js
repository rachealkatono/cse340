const reviewModel = require('../models/review-model');

async function postReview(req, res) {
  const { reviewText, invId } = req.body;
  const clientId = req.session?.user?.clientId;

  if (!clientId) {
    req.flash('error', 'You must be logged in to post a review.');
    return res.redirect('/login');
  }

  if (!reviewText || !invId) {
    req.flash('error', 'Review text is required.');
    return res.redirect(`/vehicles/details/${invId}`);
  }

  try {
    await reviewModel.addReview({ reviewText, invId, clientId });
    req.flash('success', 'Review posted successfully.');
  } catch (error) {
    console.error('Error posting review:', error);
    req.flash('error', 'Failed to post review.');
  }

  res.redirect(`/vehicles/vehicle-details/${invId}`);
}
module.exports = { postReview };