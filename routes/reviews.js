const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereview , isLoggedIn, isAuthor } = require("../middleware.js"); 
const reviewController = require("../controller/reviews.js");


//Reviews

router.post("/", isLoggedIn ,validatereview, wrapAsync(reviewController.createReview));

//Review delete route

router.delete("/:reviewId", isLoggedIn , isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;