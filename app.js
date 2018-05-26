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

app.use(expressSession({
    secret: "I studied at St. Thomas School, Bahadurgarh",
    resave: false,
    saveUninitialized: false
}));

app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret", function(req,res){
    res.render("secret");
});

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});