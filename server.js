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

// Fire this baby up
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on http://localhost:' + port);
});