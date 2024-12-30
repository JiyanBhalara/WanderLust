const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview} = require("../middleware.js")

//Add review to associated listing route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const { rating, comment } = req.body.review;
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review({ rating, comment });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Your Review Has Been Added")
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;