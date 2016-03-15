var mongoose = require('mongoose');
// define the schema for our user model
var boardSchema = mongoose.Schema({

    board            : {
        name         : String,
        metadata     : String,
    },
    column           : {
        colName      : String,
        tickets      : String, // eventually should become a list of tickets
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('kanbanBoard', boardSchema);

