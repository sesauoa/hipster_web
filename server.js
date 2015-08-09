// Require our dependencies
var http = require('http');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

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

// Schema
var todoSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  datetimeCreated: Date,
  datetimeCompleted: Date
});

todoSchema.methods.complete = function (datetimeCompleted) {
  this.datetimeCompleted = datetimeCompleted || time.now();
  this.completed = true;
  this.save();
};

todoSchema.methods.uncomplete = function () {
  this.datetimeCompleted = null;
  this.completed = false;
  this.save();
};

// Models
var Todo = mongoose.model('Todo', todoSchema);

// Our API

app.get('/api/todo', function (req, res) {
  Todo.find().exec(function (err, todos) {
    if (err) {
      res.status(500).send(err);
    }
    res.json(todos);
  })
});

app.post('/api/todo', function (req, res) {
  var newTodo = Todo(req.body);
  newTodo.save(function (err) {
    if (err) {
      res.status(500).send(err);
    }
    res.send();
  })
});

app.post('/api/todo/:id/:action', function (req, res) {
  var query = Todo.where({_id: mongoose.Types.ObjectId(req.params.id)});
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