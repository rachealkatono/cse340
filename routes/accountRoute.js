const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = express.Router();
const utilities = require("../utilities"); // Import utilities
const accountController = require("../controllers/accountController"); // Import controller

// Route to deliver the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/Register", utilities.handleErrors(accountController.buildRegister))

router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});



module.exports = router;
