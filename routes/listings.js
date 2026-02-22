const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingsController = require("../controller/listings.js");


router .route("/")
    .get( wrapAsync(listingsController.index))
    .post(isLoggedIn, validatelisting , upload.single("image"), wrapAsync(listingsController.create));


//NEW ROUTE

router.get("/new", isLoggedIn, (listingsController.new));



router.route("/:id")
    .get(wrapAsync(listingsController.show))
    .put(isLoggedIn, isOwner,upload.single("image"), validatelisting, wrapAsync(listingsController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.delete));


//EDIT ROUTE

router.get("/:id/edit",isLoggedIn, wrapAsync(listingsController.edit));


module.exports = router;