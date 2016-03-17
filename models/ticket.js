var mongoose = require('mongoose');
var user = require("./user");
//var relationship = require("mongoose-relationship");

var kTicketSchema = mongoose.Schema({
    //parent: { type:mongoose.Schema.ObjectId, ref:"kColumn", childPath:"tickets" },
    column :  { type: mongoose.Schema.ObjectId, ref : "kColumn"},
    ticket : {
    name        : String,
    id          : Number,
    priority    : Number,
    color       : String, // html style color
    colId       : String,
    assigned    : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], 
    text        : String,
    tags        : String,
    header      : String
    }
});


//kTicketSchema.plugin(relationship, { relationshipPathName:'parent' });
module.exports = mongoose.model('kTicket',kTicketSchema,'kTicket');
