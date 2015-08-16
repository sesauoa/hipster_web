// Require our dependencies
var http = require('http');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var models = require('./public/scripts/models.js');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set application stuff
app.use(logger('dev')); // Pretty logging
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use("/", express.static(__dirname + "/public/")); // Set /public as our static content dir

// Initialise the database connection
mongoose.connect('mongodb://localhost/todo');

// Our API
app.get('/api/todo', function (req, res) {
  models.Todo.find().exec(function (err, todos) {
    if (err) {
      res.status(500).send(err);
    }
    res.json(todos);
  })
});

app.post('/api/todo', function (req, res) {
  var newTodo = models.Todo(req.body);
  newTodo.save(function (err) {
    if (err) {
      res.status(500).send(err);
    }
    res.send();
  })
});

app.post('/api/todo/:id/:action', function (req, res) {
  var query = models.Todo.where({_id: mongoose.Types.ObjectId(req.params.id)});
  query.findOne(function (err, todo) {
      switch (req.params.action) {
        case 'complete':
          todo.complete(req.body.datetimeCompleted);
          break;
        case 'uncomplete':
          todo.uncomplete();
      }
      res.send();
    });
});

// Fire this baby up
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on http://localhost:' + port);
});