const User = require("../models/user.js");

module.exports.registerUser = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if (err) {
                return next(err);
            }
        });
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};


module.exports.loginUser = async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};


module.exports.logoutUser =  (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    req.flash("success","Logged!");
    res.redirect("/listings");
    });
};