if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');


const reviewsRouter = require("./routes/reviews.js");
const listingsRouter = require("./routes/listings.js");
const userRouter = require('./routes/user.js');

const app = express();

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => console.log("connect to DB"))
    .catch(err => console.log(err));

async function main() {
    mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "thisshouldbeabettersecret!"
    },
    touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000 ,
        httpOnly: true,
    },
};  

 /* app.get('/', (req, res) => {
    res.send('Hello World');
});  */



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));  

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
})

 /*app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email : "fake@example.com",
        username: "Nikhil"
    });

    let registeredUser = await User.register(fakeUser, "chicken"); // this will hash the password and save the user to the database
    res.send(registeredUser);
});   */


//routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { message });
    // res.status(statusCode).send(message);
});


/* app.get("/listing" , async (req,res) => {
    let sampleListing = new Listing({
        title: "Beautiful Beach resort",
        description: "A lovely resort by the beach with stunning views.",
        price: 1500,
        location: "Goa",
        country:"India"
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("successful testing"); 

}); */

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});