var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    name: String,
    location: String,
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    description: String
});

var Event = mongoose.model("Event", eventSchema);
module.exports = Event;