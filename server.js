// Require our dependencies
var http = require('http');
var express = require('express');
var logger = require('morgan');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set up logging
app.use(logger('dev'));

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this baby up
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on http://localhost:' + port);
});