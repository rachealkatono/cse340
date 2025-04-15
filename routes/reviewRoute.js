// Required Resources
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review-controller");

// Route to handle review submission
router.post("/submit", reviewController.submitReview);

module.exports = router;
