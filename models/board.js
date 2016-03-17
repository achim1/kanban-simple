var mongoose = require('mongoose');
// var cols     = require("./columns");
// define the schema for our user model
var boardSchema = mongoose.Schema({
    user             : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    colunms: [{type: mongoose.Schema.Types.ObjectId, ref: 'kColumn'}],
    board            : {
       
        name         : String,
        metadata     : String,
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('kanbanBoard', boardSchema, 'kanbanBoard');

