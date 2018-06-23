var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    name: String,
});


var subscriber = mongoose.model("sub", userSchema);


module.exports = subscriber;