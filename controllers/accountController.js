const bcrypt = require("bcryptjs") 
const accModel = require("../models/account-model")
const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the login view.")
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 100)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  // 
  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    // account_password
    hashedPassword // team activity #2 week 04
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

// team activity #2 week 04
/* ****************************************
*  Process login
* *************************************** */
async function registerLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const regResult = await accModel.registerLogin(
    account_email,
    // hashedPassword
    account_password
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re logged in ${account_firstname}.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Process add classification
 * ************************** */
async function addClassification (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  try {
    // Insert the new classification into the database
    await invModel.addClassification(classification_name);

    // Flash success message
    req.flash("success", "Classification added successfully.");
    res.redirect("/inv/"); // Redirect to the management view
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("error", "Failed to add classification.");
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }],
    });
  }
};

/* ***************************
 *  Process add inventory
 * ************************** */
async function addInventory (req, res, next) {
  try {
    const classificationList = await Util.buildClassificationList();
    res.render('./inventory/add-inventory', {
        title: 'Add Inventory Item',
        classificationList: classificationList,
        errors: null,
        message: null,
        ...req.body, // Sticky data
    });
} catch (err) {
    next(err);
}
};


module.exports = { buildLogin, buildRegister, registerAccount, registerLogin }