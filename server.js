// server.js

// set up ========================
var express  = require('express');
var mongoose = require('mongoose'); 
var morgan = require('morgan');     
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// own models
var user = require('./user')

// configuration =================
mongoose.connect('mongodb://localhost/kanban-simple');  

var app      = express();           
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Todo = mongoose.model('Todo', {
           text : String
           });

user.create({ twitter : {id :  '1234'}},function(err,blubb){});


// routes =======================

// api ---------------------------------------------------------------------
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
