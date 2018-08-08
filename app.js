const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose'),
    FacebookStrategy         = require('passport-facebook').Strategy,
    path                     = require('path'),
    methodOverride           = require('method-override');
    nodemailer               = require('nodemailer');
    welcomeMail              = require('./mailer');
    ejs                      = require('ejs');
    fs                       = require('fs');
const pdf = require('html-pdf');
let QRCode = require('qrcode')


let User = require('./models/user'),
    Event = require('./models/event'),
    BlogPost = require('./models/blogPost');
    Subscriber = require('./models/subscriber');


mongoose.connect("mongodb://dev:dev@ds237620.mlab.com:37620/evenox");


let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

let fbLoginInfo = {
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
    let me = new User({
        email: profile.emails[0].value,
        username:profile.displayName,
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
    else res.render("landing", {currentUser: req.user});
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
            res.render('Auth/register', {currentUser: req.user});
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("/events");
            })
        }
    });
    console.log("Posted");
});

app.get("/secret", ensureLoggedIn(), function(req,res){
    res.render("Auth/secret");
});

app.get("/login", function(req,res){
    if (req.isAuthenticated())
    {
        res.redirect('/events');
    }
    else {
        res.render('Auth/reg-login.ejs', {currentUser: req.user})
    }
});

app.post('/login', passport.authenticate("local", {
    failureRedirect: "/login"
}),function(req,res){
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function ensureLoggedIn() {
    return function(req, res, next) {
        // isAuthenticated is set by `deserializeUser()`
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            req.session.returnTo = req.path;
            res.redirect("/login");
        } else {
            next()
        }
    }
}

/////////////////////////My Profile Routes///////////////////////////////////////////
app.get("/user/calendar", ensureLoggedIn(), function(req,res){
    res.render("Profile/calendar", {currentTab: "calendar"});
});
app.get("/user/dashboard", ensureLoggedIn(), function(req,res){
    res.render("Profile/dashboard", {currentTab: "dashboard"});
});
app.get("/user/tickets", ensureLoggedIn(), function(req,res){
    res.render("Profile/tickets", {currentTab: "tickets"});
});
app.get("/user/certificates", ensureLoggedIn(), function(req,res){
    res.render("Profile/certificates", {currentTab: "certificates"});
});
app.get("/user/events", ensureLoggedIn(), function(req,res){
    res.render("Profile/events", {currentTab: "events"});
});

/////////////////////////Events Routes///////////////////////////////////////////
app.get("/events/new", ensureLoggedIn(), function(req, res){
    res.render("Events/newEvent", {currentUser: req.user});
});
app.post("/events", ensureLoggedIn(), function(req,res){
    let startArr = req.body.startTime.split('T');
    let endArr = req.body.endTime.split('T');
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    Event.create({
        name: req.body.eventName,
        location: req.body.location,
        stDetails: req.body.startTime,
        endDetails: req.body.endTime,
        startDate: startArr[0],
        startTime: startArr[1],
        endDate: endArr[0],
        endTime: endArr[1],
        description: req.body.Description,
        author : author
    }, function(err, event){
        console.log(event);
        if(err) {
            console.log(err);
        } else {
            res.redirect("/events");
        }
    });
    console.log(startArr);
    console.log(req.body);
});


app.put("/events/:id/edit",checkOwner(), function(req, res){

    if (req.isAuthenticated()) {

    }

    let startArr = req.body.startTime.split('T');
    let endArr = req.body.endTime.split('T');
    let toUpdate = {
        name: req.body.eventName,
        location: req.body.location,
        stDetails: req.body.startTime,
        endDetails: req.body.endTime,
        startDate: startArr[0],
        startTime: startArr[1],
        endDate: endArr[0],
        endTime: endArr[1],
        description: req.body.Description,
    };
    Event.findByIdAndUpdate(req.params.id, toUpdate, function(err, updated){
        if (err) console.log(err);
        else console.log(updated);
        let redirectStringUrl = "/events/" + req.params.id;
        res.redirect(redirectStringUrl);

    });
});

app.get('/events', function(req,res){
    Event.find({},function(err, events){
        if (err) {
            console.log(err);
        }
        else {
            res.render("Events/events", {events: events, currentUser: req.user});
        }

    });
});

app.get("/events/:id", function(req,res){
    let id = req.params.id;

    Event.findById(id, function(err, event){
        if(err) {
            console.log(err)
        }
        else {
            res.render("Events/EventTemplate", {event: event, currentUser: req.user});
        }

    });
});

app.get("/events/:id/edit", checkOwner(), function(req,res){

    Event.findById(req.params.id, function(err, event){
            if(err) res.redirect("/events");
            else {
                if (event.author.id.equals(req.user._id))
                res.render("Events/edit",{event:event, currentUser: req.user});
                else console.log("Not your event sorry");
            }
        });
});


app.delete("/events/:id",checkOwner(), function(req,res){
    Event.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/events");
        }
        else {
            res.redirect("/events");
        }
    })
});

//Check Ownership
function checkOwner() {
    return function(req, res, next) {
        // isAuthenticated is set by `deserializeUser()`
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).send({
                success: false,
                message: 'You need to be authenticated to access this page!'
            })
        } else {
            Event.findById(req.params.id, function(err, event){
                if(err) res.redirect("/events");
                else {
                    if (event.author.id.equals(req.user._id))
                        next();
                    else res.redirect("back");
                }
            });


        }
    }
}

/////////////////// BLOG /////////////////////////////
app.get("/blog/posts", function(req,res){
    BlogPost.find({}, function(err,posts){
        if (err) console.log(err);
        else res.render('blog/blogIndex', {posts:posts, currentUser: req.user});
    });
});
app.post("/blog/posts", ensureLoggedIn(), function(req,res) {
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    BlogPost.create({
        title: req.body.title,
        content: req.body.content,
        author : author
    }, function(err, event){
        console.log(event);
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blog/posts");
        }
    });
    console.log(req.body);
});
app.get("/blog/posts/new", ensureLoggedIn(), function(req,res){
    res.render('blog/new.ejs', {currentUser: req.user});
});
app.get("/blog/posts/:id", function(req,res){
    let id = req.params.id;

    BlogPost.findById(id, function(err, post){
        if(err) {
            console.log(err)
        }
        else {
            res.render("blog/show", {post: post, currentUser: req.user});
        }

    });
});
app.get("/blog/posts/:id/edit", ensureLoggedIn(), function(req, res){
    BlogPost.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render("blog/edit", {post: post, currentUser: req.user});
        }

    });
});
app.put("/blog/posts/:id/edit", ensureLoggedIn(), function(req, res){
    BlogPost.findByIdAndUpdate(req.params.id, {$set:{title: req.body.title, content: req.body.content}}, function(err, updated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blog/posts/"+req.params.id);
        }
    })
});
app.delete("/blog/posts/:id", ensureLoggedIn(), function(req, res){
    BlogPost.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/blog/posts");
    })
});

app.post("/subscribe", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    console.log(req.body);
    welcomeMail(name, email, req, res);

});
app.get("/generatePdf", (req,res)=>{

    let information = {
        name: "ABC"
    };
    let path = __dirname + '/static/ticket.ejs';
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) { console.log(err); return false; }

        let ejs_string = data,
            template = ejs.compile(ejs_string),
            html = template(information);

        fs.writeFile(path + '.html', html, function(err) {
            if(err) {
                console.log(err); return false
            }
            console.log("HTML created");
            createPdf(path + '.html');
        });
    });

    function createPdf(path){
        const html = fs.readFileSync(require.resolve(path), 'utf8')

        pdf.create(html, {format: "letter"}).toStream((err, stream) => {
            if (err) return res.end(err.stack);
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res)
        })
    }
});
app.get("/secretURL/subscribers", (req, res)=>{
    Subscriber.find({}, function(err, subscribers){
        res.send(subscribers);
    })
});
app.get('/2', function(req,res){
    QRCode.toDataURL('I am a pony!', function (err, url) {
        res.render('qr-try');
    })
})


app.get('/t', (req, res)=> {
    res.render('ticketTemp')
});
app.get('/e', (req, res)=> {
    res.render('Events/EventTemplate');
});
app.get('/tryShow', function(req,res){
    res.render('Events/show', {currentUser: req.user});

});

app.get('/enroll/:event_id', ensureLoggedIn(), function(req, res) {
    Event.findById(req.params.event_id, function(err, event){
        res.render("tickets/getTicket", {currentUser: req.user, event: event})
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let port = process.env.PORT || 5000,
    ip   = '0.0.0.0';


app.listen(port, ip, function(){

    console.log("Running on port " + port);
});