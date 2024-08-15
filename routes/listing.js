const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

// validating listing for schema validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./Listings/index.ejs", { allListing });
  })
);

// New listing route
router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("./Listings/CreateListing.ejs");
  })
);

// Add new listing to database
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing Added Successfully")
    res.redirect("/listings");
  })
);

// Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing You are Looking For Doesn't Exit");
      res.redirect("/listings");
    }else{
      res.render("./Listings/UpdateListing.ejs", { listing });
    }
  })
);

// Update route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const ShowListing = await Listing.findById(id).populate("reviews");
    if(!ShowListing){
      req.flash("error", "Listing You Are Looking For Doesn't Exit");
      res.redirect("/listings")
    }else{
      res.render("./Listings/showListing.ejs", { ShowListing });
    }
  })
);

module.exports = router;