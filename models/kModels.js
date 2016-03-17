// The kanban board
// each user can have multiple boards
// and a board has multiple columns
// the tickets are attached to the columns

var mongoose = require('mongoose');
var _ = require('underscore');

var firstCap = function(str){
    var strCap = str.charAt(0).toUpperCase() + str.slice(1);
    return strCap};


var methods = {
    adder : function(element){
        return function(toAdd){
        this[element].push(toAdd)}
    },
    remover : function(element){
        return function(toRemove){
        var index = this[element].indexOf(column._id);
        if (index > -1){
        this[element].splice(index,1)};
        };
        },
    changer : function(element,parentElement){
        return function(toChange){
        if (parentElement !== null){
            this[parentElement][element] = toChange;
            } else {
        this[element] = toChange};
                };
            },
        
};

var boardSchema = mongoose.Schema({
    user             : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    collaborators    : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    columns: [{type: mongoose.Schema.Types.ObjectId, ref: 'kColumn'}],
    board            : {
        name         : String,
        metadata     : String,
    }
});

boardSchema.methods.addCollaborator = methods.adder('collaborators');
boardSchema.methods.removeCollaborator = methods.remover('collaborators');
boardSchema.methods.addColumn = methods.adder('columns');
boardSchema.methods.removeColumn = methods.remover('columns');
boardSchema.methods.changeName = methods.changer('name','board');

// A column of the board
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

// provide changers for all properties
var colFields = _.map(kColumnSchema.tree.column,function(x){ return x});
colFields = _.filter(colFields,function(x){x !== 'tickets'})
_.each(colFields, function(el){
elCap =  firstCap(el);
kTicketSchema.methods["change" + elCap] = methods.changer(el,'column');
});

kColumnSchema.methods.addTicket = methods.adder("tickets");
kColumnSchema.methods.removeTicket = methods.remover("tickets");
//

// tickets can be attached to columns on a board
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

kTicketSchema.methods.addUser = methods.adder("ticket.assigned")
kTicketSchema.methods.removeUser = methods.remover("ticket.assigned")

// provide changers for all properties
var ticketFields = _.map(kTicketSchema.tree.column,function(x){ return x});
ticketFields = _.filter(colFields,function(x){x !== 'assigned'})

_.each(ticketFields, function(el){
elCap =  firstCap(el);
kTicketSchema.methods["change" + elCap] = methods.changer(el,'ticket');
});

module.exports = {'kColumn' :  mongoose.model("kColumn",kColumnSchema,"kColumn"),
'kBoard' :  mongoose.model('kanbanBoard', boardSchema, 'kanbanBoard'),
'kTicket' :  mongoose.model('kTicket',kTicketSchema,'kTicket')
}

