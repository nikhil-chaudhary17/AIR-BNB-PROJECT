const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");



//Signup form

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.registerUser));

//Login user

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
     userController.loginUser);

//Logout user

router.get("/logout", userController.logoutUser);

module.exports = router; 