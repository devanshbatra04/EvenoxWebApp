var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    name: String,
    location: String,
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    description: String,
    stDetails: String,
    endDetails: String,
    author : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
    username: String
    }
});

var Event = mongoose.model("Event", eventSchema);
module.exports = Event;