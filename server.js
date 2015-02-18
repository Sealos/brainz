'use strict';

// Module dependencies.
var express = require('express');
var config = require('./app/config/config');
var mongoose = require('mongoose');
var validator = require('express-validator');
var _ = require('lodash');
var crypto = require('crypto');

// Call express and define our app using express
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.listen(config.port);

// Debug mongoose
if (process.env.NODE_ENV === 'development') {

	console.log('Running on development build');
	console.log('REST API listening on port ' + config.port);

	app.use(function route(req, res, next) {
		console.log('Request from: ', req.method, req.path);
		next();
	});

	mongoose.set('debug', true);
	app.set('view options', {
		debug: true
	});
}

// Connect to the database
mongoose.connect(config.db);

// We disable the powered by sent in responses
// No need to tell anyone we're using express
app.disable('x-powered-by');

app.use(function allowCrossDomain(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Agent, X-Geolocation, User-Agent, X-Device, X-App-Version');

	// Intercept OPTIONS methods
	if (req.method === 'OPTIONS')
		res.status(200).send();
	else
		next();
});

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(validator([]));
app.use(methodOverride());

var bikeRouter = require('./app/routes/bike');

// Routes are defined
app.use('/api/bike', bikeRouter);

/**
 * Called on ^C keyboard interruption
 */
process.on('SIGINT', function onInterruption() {
	app.close();
	process.exit();
});

/**
 * Something went horribly wrong, no need to crash just alert
 */
process.on('uncaughtException', function onException(err) {
	errorController.onFunctionError(err);
});
