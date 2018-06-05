const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose'),
    FacebookStrategy         = require('passport-facebook').Strategy,
    path                     = require('path');

var User = require('./models/user'),
    Event = require('./models/event');
mongoose.connect("mongodb://localhost/Evenox");


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static(__dirname + '/public'));

var fbLoginInfo = {
    "cookieSecret":"e33cf67dd274b91847ae9991359e2abf",
    "facebook":{
    "app_id":"186261948694142",
        "app_secret":"e33cf67dd274b91847ae9991359e2abf",
        "callback":"http://localhost:5000/auth/facebook/callback"
    }
};

app.use(require("express-session")({
    secret: "Please work this time",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new FacebookStrategy({
    clientID: fbLoginInfo.facebook.app_id,
    clientSecret: fbLoginInfo.facebook.app_secret,
    callbackURL: fbLoginInfo.facebook.callback,
    profileFields:['id', 'displayName', 'emails']},
    function(accessToken, refreshToken, profile, done){
    var me = new User({
        email: profile.emails[0].value,
        name:profile.displayName,
        _id: new mongoose.Types.ObjectId()
    });
    User.findOne({email:me.email}, function(err,u){
        if(!u){
            me.save(function(err, user){
                if (err) {
                    return done(err);
                }
                else {
                    console.log("here");
                    done(null, me);
                }
            })
        }
        else {
            console.log("here");
            return done(null,u);
        }
    });
    console.log("here");
    console.log(profile);
    }));

passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////// ROUTES//////////////////////////////////////////////////////////

app.get('/auth/facebook', passport.authenticate('facebook', {scope:"email"}));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
    { successRedirect: '/', failureRedirect: '/login' }));

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/", function(req,res){
    if (req.isAuthenticated()) {
        res.redirect('/events');
    }
    else res.render("landing");
});

app.get("/user", ensureLoggedIn(), function(req,res){
    console.log("chalna chahiye");
    res.render("calendar");
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

app.get("/secret", ensureLoggedIn(), function(req,res){
    res.render("secret");
});

app.get("/login", function(req,res){
    res.render('reg-login.ejs');
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

function ensureLoggedIn() {
    return function(req, res, next) {
        // isAuthenticated is set by `deserializeUser()`
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).send({
                success: false,
                message: 'You need to be authenticated to access this page!'
            })
        } else {
            next()
        }
    }
}



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

app.get('/events', function(req,res){
    console.log("here");
    Event.find({},function(err, events){
        if (err) {
            console.log(err);
        }
        else {
            res.render("events", {events: events});
        }

    });
});

app.get("/events/:id", function(req,res){
    var id = req.params.id;

    Event.findById(id, function(err, event){
        if(err) {
            console.log(err)
        }
        else {
            res.render("eventPage", {event: event});
        }

    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});