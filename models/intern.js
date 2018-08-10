var mongoose = require('mongoose');

var internSchema = mongoose.Schema({
    name: String,
    roll: String,
    mob: String,
    email: String,
    interest: String,
    note: String,
    approved: Boolean
});

var Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;