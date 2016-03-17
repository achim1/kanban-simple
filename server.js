// server.js

// set up ========================
var express  = require('express');
var mongoose = require('mongoose'); 
var morgan = require('morgan');     
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// own models
var User = require('./models/user');
var Todo = require('./models/todo');
var kBoard = require('./models/board');
var kTicket = require('./models/ticket');
var kColumn = require('./models/column');
// configuration =================
mongoose.connect('mongodb://localhost/kanban-simple');  

var deleteAll = function(){
    mongoose.connection.collections['User'].drop( function(err) {
    console.log('collection dropped');
});
    mongoose.connection.collections['kanbanBoard'].drop( function(err) {
    console.log('collection dropped');
});
    mongoose.connection.collections['kColumn'].drop( function(err) {
    console.log('collection dropped');
});
    mongoose.connection.collections['kTicket'].drop( function(err) {
    console.log('collection dropped');
});
};
//deleteAll();
var app      = express();           
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var modelCallback = function(err,res){console.log(err + res)};

var thisuser = new User({ twitter : {id :  '1234'}, local : {id : 1}});
thisuser.save(modelCallback)//,function(err,blubb){});


// create a board
var board = new kBoard({ 
        user         : thisuser._id,
        board        : {
        name         : "testbrett",
        metadata     : "blubb",
    },
})
board.save(modelCallback);
var firstColumn = new kColumn({
    board   : board._id,
    column : {
    name        : 'first',
    id          : 1,
    color       : 'red', // html style color
    colId       : 'one',
    header      : 'most important stuff',
}});
firstColumn.save(modelCallback);
var secondColumn = new kColumn({
    board   : board._id,
    column : {
    name        : 'second',
    id          : 2,
    color       : 'green', // html style color
    colId       : 'two',
    header      : 'not so important stuff',
}});
secondColumn.save(modelCallback);
var ticket = new kTicket(  {
 column : firstColumn._id,
 ticket:
 { name        : "Something to do",
 id          : 1,
 priority    : 2,
 color       : "blue", // html style color
 colId       : 3,
 //assigned    : [thisuser._id], // eventually this shall be users
 text        : "Everything is broken",
 tags        : "#ohno",
 header      : "FIXTHIS"
}});
ticket.ticket.assigned.push(thisuser);
thisuser.tickets.push(ticket);
ticket.save(modelCallback);
// routes =======================

// api ---------------------------------------------------------------------
app.get('/api/users', function(req, res) {
    User.find().populate('tickets').exec(function(err,users){
    res.json(users);
    })});
app.get('/api/boards', function(req, res) {
    kBoard.find().populate('user').exec(function(err,boards){
    res.json(boards);
    })});
app.get('/api/columns', function(req, res) {
    kColumn.find().populate('board column.tickets').exec(function(err,cols){
    res.json(cols);
    })});
app.get('/api/tickets', function(req, res) {
    kTicket.find().populate("ticket.assigned").exec(function(err,tix){
    res.json(tix)})    });



// get all todos
app.get('/api/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err)
    res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
// create a todo, information comes from AJAX request from Angular
    Todo.create({
      text : req.body.text,
      done : false
 }, function(err, todo) {
    if (err)
      res.send(err);
// get and return all the todos after you create another
    Todo.find(function(err, todos) {
    if (err)
      res.send(err)
    res.json(todos);
  });
  });
});
// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
Todo.remove({
  _id : req.params.todo_id
}, function(err, todo) {
 if (err)
        res.send(err);
   // get and return all the todos after you create another
   Todo.find(function(err, todos) {
    if (err)
      res.send(err)
   res.json(todos);
        });
   });
});
// application -------------------------------------------------------------
app.get('*', function(req, res) {
         res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


//// app/routes.js
//
//module.exports = function(app, passport) {
//
//    // route for home page
//    app.get('/', function(req, res) {
//        res.render('index.ejs'); // load the index.ejs file
//    });
//
//    // route for login form
//    // route for processing the login form
//    // route for signup form
//    // route for processing the signup form
//
//    // route for showing the profile page
//    app.get('/profile', isLoggedIn, function(req, res) {
//        res.render('profile.ejs', {
//            user : req.user // get the user out of session and pass to template
//        });
//    });
//
//    // route for logging out
//    app.get('/logout', function(req, res) {
//        req.logout();
//        res.redirect('/');
//    });
//
//    // facebook routes
//    // twitter routes
//
//    // =====================================
//    // GOOGLE ROUTES =======================
//    // =====================================
//    // send to google to do the authentication
//    // profile gets us their basic information including their name
//    // email gets their emails
//    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
//
//    // the callback after google has authenticated the user
//    app.get('/auth/google/callback',
//            passport.authenticate('google', {
//                    successRedirect : '/profile',
//                    failureRedirect : '/'
//            }));
//
//};
//
//// route middleware to make sure a user is logged in
//function isLoggedIn(req, res, next) {
//
//    // if user is authenticated in the session, carry on
//    if (req.isAuthenticated())
//        return next();
//
//    // if they aren't redirect them to the home page
//    res.redirect('/');
//}
//
//

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");
