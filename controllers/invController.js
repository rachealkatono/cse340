const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })

}

/* ***************************
 *  Build vehicle detail view by inventory ID
 * ************************** */
invCont.getInventoryItemDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inventoryId; // Extract the inventory ID from the route
    const vehicle = await invModel.getVehicleById(inv_id);

    if (!vehicle || vehicle.length === 0) {
      return res.status(404).render("errors/error", { title: "Vehicle Not Found" });
    }

    let nav = await utilities.getNav(); // Generate navigation
    const vehicleHTML = await utilities.buildVehicleDetailHTML(vehicle);

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`, // Set dynamic title
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error("Error fetching vehicle detail:", error);
    next(error);
  }
};

module.exports = invCont