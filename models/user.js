var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var relationship = require("mongoose-relationship");

// define the schema for our user model
var userSchema = mongoose.Schema({
    //parent: { type:mongoose.Schema.ObjectId, ref:"kTicket", childPath:"user" },
    tickets          : [{ type: mongoose.Schema.ObjectId, ref: 'kTicket'}],
    boards           : [{ type: mongoose.Schema.ObjectId, ref: 'kanbanBoard'}],
    local            : {
        id           : Number,
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
//userSchema.plugin(relationship, { relationshipPathName:'parent' });

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema,"User");
