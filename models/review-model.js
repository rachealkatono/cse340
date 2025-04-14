const db = require('../db');

async function addReview({ reviewText, invId, clientId }) {
  return db('reviews').insert({
    reviewText,
    invId,
    clientId,
    reviewDate: new Date()
  });
}

async function getReviewsByVehicle(invId) {
  return db('reviews')
    .join('clients', 'reviews.clientId', '=', 'clients.clientId')
    .select(
      'reviews.reviewText',
      'reviews.reviewDate',
      'clients.clientFirstname',
      'clients.clientLastname'
    )
    .where('invId', invId)
    .orderBy('reviewDate', 'desc');
}

module.exports = {
  addReview,
  getReviewsByVehicle
};