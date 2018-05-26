const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose'),
    expressSession           = require('express-session');

var User                     = require('./models/user');

mongoose.connect("mongodb://localhost/Evenox");

var app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession({
    secret: "I studied at St. Thomas School, Bahadurgarh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//------------------------------ ROUTES ------------------------------//

app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret", function(req,res){
    res.render("secret");
});

//Signup Form
app.get("/register", function(req, res){
    res.render("register");
});

//Signup Post Route
app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.userName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        name: req.body.name
    });

    User.register(newUser, req.body.password, function(error, user){
        if (error){
            console.log("could not register user");
            console.log(error);
        }
        console.log("User Registered");

    });

    console.log(req.body);
    res.send("User received");
});

//--------------------------------------------------------------------//


var port = process.env.PORT || 5000;






app.listen(port, function(){
    console.log("Running on port " + port);
});