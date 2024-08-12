const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const app = express();
const Mongo_URL = "mongodb://localhost:27017/wanderlust";
const { listingSchema, reviewSchema } = require("./schema.js");

// Connect to MongoDB
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(Mongo_URL);
}

// Set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.redirect("/listings");
  })
);

// validating listing for schema validation
const validateListing = (req, res, next) => {
  console.log(req.body)
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// //validating review for schema validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./Listings/index.ejs", { allListing });
  })
);

// New listing route
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("./Listings/CreateListing.ejs");
  })
);

// Add new listing to database
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Add review to associated listing route
app.post(
  "/listings/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    const { rating, comment } = req.body.review;
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review({ rating, comment });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
  })
);

// Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./Listings/UpdateListing.ejs", { listing });
  })
);

// Update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

// Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req,res)=>{
  const {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const ShowListing = await Listing.findById(id).populate("reviews");
    res.render("./Listings/showListing.ejs", { ShowListing });
  })
);

// Error handling for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("./Listings/Error.ejs", { message });
});

// Start the server
app.listen(5000, () => {
  console.log("App listening on port 5000");
});
