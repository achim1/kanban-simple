var mongoose = require('mongoose');
//var relationship = require("mongoose-relationship");
//var kTick = require("./ticket");

var kColumnSchema = mongoose.Schema({
    board  : { type: mongoose.Schema.Types.ObjectId, ref: "kanbanBoard"},
    column : {
    name        : String,
    id          : Number,
    color       : String, // html style color
    colId       : String,
    header      : String,
    tickets     : [{type: mongoose.Schema.Types.ObjectId, ref: 'kTicket'}]
    }
});

module.exports = mongoose.model("kColumn",kColumnSchema,"kColumn")

