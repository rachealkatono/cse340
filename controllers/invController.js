const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const reviewModel = require("../models/review-model");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const error = new Error("Vehicle classification not found");
      error.status = 404;
      throw error;
    }

    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail page with reviews
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.id;

    const vehicle = await invModel.getDetailByVehicleId(vehicleId);
    const reviews = await reviewModel.getReviewsByVehicle(vehicleId);

    if (!vehicle) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "We couldn't find a vehicle with that ID.",
        nav: res.locals.nav,
      });
    }

    const nav = await utilities.getNav();
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    res.render("inventory/vehicle", {
      title,
      vehicle,
      reviews,
      nav,
      accountData: res.locals.accountData,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildVehicleDetail:", error.message);
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
