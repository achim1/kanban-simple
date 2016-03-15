var mongoose = require('mongoose');

var kTicket = mongoose.model("kTicket",{
    name        : String,
    id          : Number,
    priority    : Number,
    color       : String, // html style color
    colId       : String,
    assinged    : String, // eventually this shall be users
    text        : String,
    tags        : String,
    header      : String
});

module.exports = kTicket;
