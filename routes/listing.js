const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner,validateListing } = require("../middleWare.js")
const listingController = require("../controller/listing.js")

const multer = require("multer")
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


// Index route
router.get("/", wrapAsync(listingController.index));

// New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route
router.post("/",isLoggedIn, upload.single("listing[image]"), validateListing,wrapAsync(listingController.createListing));


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

// Update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
