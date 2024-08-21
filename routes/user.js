const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("./Users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      })
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
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings"
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect(redirectUrl);
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
