'use strict';

var mongoose = require('mongoose');

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
module.exports = {
  Todo: mongoose.model('Todo', todoSchema)
};