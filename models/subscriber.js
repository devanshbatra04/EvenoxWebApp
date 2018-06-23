var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    email: String,
    name: String,
});

userSchema.plugin(passportLocalMongoose);


var subscriber = mongoose.model("subscriber", userSchema);


module.exports = subscriber;