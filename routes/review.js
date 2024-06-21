const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn , isReviewAuthor } = require("../middleWare")
const reviewController = require("../controller/review")




// Post route to create a new review
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// Delete route to remove a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
