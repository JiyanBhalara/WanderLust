const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("./Users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      await User.register(newUser, password);
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message + ". Please try again!");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("./Users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/listings");
  }
);

//logout user
router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You have been logged out");
    res.redirect("/listings");
  })
})
module.exports = router;
