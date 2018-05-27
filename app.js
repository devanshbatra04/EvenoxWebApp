const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose');

var User = require('./models/user'),
    Event = require('./models/event');

mongoose.connect("mongodb://localhost/Evenox");


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.use(require("express-session")({
    secret: "Please work this time",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////// ROUTES//////////////////////////////////////////////////////////

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/", function(req,res){
    res.render("home");
});

app.post("/register", function(req,res){
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone
    }), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render('register');
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("secret");
            })
        }
    });
    console.log("Posted");
});

app.get("/secret", isLoggedIn, function(req,res){
    res.render("secret");
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect: "/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next;
    }    else {
        res.redirect('/login');
    }
}

app.get("/events", function(req,res){
    res.send("<h1>Events will be populated here</h1>");
});

app.get("/events/new", function(req, res){
    res.render("newEvent");
});

app.post("/events", function(req,res){
    var startArr = req.body.startTime.split('T');
    var endArr = req.body.endTime.split('T');
    Event.create({
        name: req.body.eventName,
        location: req.body.location,
        startDate: startArr[0],
        startTime: startArr[1],
        endDate: endArr[0],
        endTime: endArr[1],
        description: req.body.Description
    }, function(err, event){
        if(err) {
            console.log(err);
        } else {
            console.log(event);
        }
    });
    console.log(startArr);
    console.log(req.body);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});