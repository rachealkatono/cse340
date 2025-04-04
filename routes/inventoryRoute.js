// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display specific vehicle detail by ID
router.get("/detail/:inventoryId", invController.getInventoryItemDetail)

// Route to display classification and inventory links
router.get("/", invController.getManagementView)

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassificationView)

// Process the add classification form
router.post("/add-classification", 
    invController.addClassification
)

router.get("/add-inventory", invController.buildAddInventoryView);

// Process the add inventory form
router.post("/add-inventory", 
    invController.addInventory
)

module.exports = router;