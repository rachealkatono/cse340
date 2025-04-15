const pool = require("../database/");

/**
 * Retrieve a single vehicle by its ID
 */
async function getVehicleById(id) {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1";
  const result = await pool.query(sql, [id]);
  return result.rows[0];
}

/**
 * Get all reviews for a specific vehicle
 */
async function getReviewsByVehicle(inv_id) {
  const sql = `
    SELECT 
      r.review_text, 
      r.review_date, 
      r.account_id, 
      a.account_firstname, 
      a.account_lastname
    FROM reviews r
    JOIN account a ON r.account_id = a.account_id -- 
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows;
}

/**
 * Insert a new review for a vehicle
 */
async function insertReview({ review_text, inv_id, account_id }) {
  const sql = `
    INSERT INTO reviews (review_text, inv_id, account_id, review_date)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
  `;
  await pool.query(sql, [review_text, inv_id, account_id]);
}

module.exports = {
  getVehicleById,
  getReviewsByVehicle,
  insertReview
};
