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

invCont.getManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  return res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  // Server-side validation
  if (!classification_name || classification_name.trim() === "") {
      req.flash("error", "Classification name must be alphanumeric with no spaces or special characters.");
      return res.render("inventory/add-classification", {
          title: "Add Classification",
          nav,
          errors: [{ msg: "Classification name is required." }],
      });
  }

  try {
      // Insert the new classification into the database
      await invModel.addClassification(classification_name);

      // Flash success message
      req.flash("success", "Classification added successfully.");
      res.redirect("/inv/"); // Redirect to the management view
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("error", "Failed to add classification.");
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: [{ msg: "Failed to add classification." }],
    });
}
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res) {
    let nav = await utilities.getNav(); // Ensure this function is defined and returns navigation data
    const classificationList = await utilities.buildClassificationList(); // Ensure this function is defined and returns the classification list
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList, // Pass the classification list to the view
        locals: {
            inv_make: '',
            inv_model: '',
            inv_year: '',
            inv_description:'',
            inv_image: '/images/vehicles/no-image-available.jpg', // Default image path
            inv_price: '',
            inv_thumbnail: '/images/vehicles/no-image-available.jpg',
            inv_miles:'',
            inv_color:''
        }
    });
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav();
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;

    // Server-side validation
    if (!inv_make || !inv_model || !inv_year || !inv_description || !inv_image || !inv_thumbnail || !inv_price || !inv_miles || !inv_color || !classification_id) {
        req.flash("error", "All fields are required.");
        return res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: [{ msg: "All fields are required." }],
            classificationList: await utilities.buildClassificationList(classification_id), // Rebuild the classification list
            locals: {
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
            }
        });
    }

    try {
        // Insert the new vehicle into the database
        await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

        // Flash success message
        req.flash("success", "Vehicle added successfully.");
        res.redirect("/inv/"); // Redirect to the management view
    } catch (error) {
        console.error("Error adding vehicle:", error);
        req.flash("error", "Failed to add vehicle.");
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: [{ msg: "Failed to add vehicle." }],
            classificationList: await utilities.buildClassificationList(classification_id), // Rebuild the classification list
            locals: {
              inv_make,
              inv_model,
              inv_year,
              inv_description,
              inv_image,
              inv_thumbnail,
              inv_price,
              inv_miles,
              inv_color,
            }
        });
    }
};



module.exports = invCont