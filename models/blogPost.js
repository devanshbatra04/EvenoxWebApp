var mongoose = require('mongoose');

var blogPostSchema = mongoose.Schema({
    title: String,
    content: String,
    date: String,
    author : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    }
});

var Event = mongoose.model("BlogPost", blogPostSchema);
module.exports = Event;