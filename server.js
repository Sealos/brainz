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
app.use(validator({
	customValidators: {
		isValidLocation: function(value) {
			var arr = value.split(',');
			if (arr.length !== 2)
				return false;
			if (isNaN(parseFloat(arr[0])) || isNaN(parseFloat(arr[1])))
				return false;
			return true;
		},
		isDate: function(input) {
			try {
				var isoStr = ('' + input).replace(/ /, 'T') + 'Z';
				var newStr = new Date(isoStr).toISOString();
				return isoStr.slice(0, 19) === newStr.slice(0, 19);
			} catch (e) {
				return false;
			}
		},
		isPositiveInt: function(value) {
			return value >>> 0 === parseFloat(value);
		},

		isPositiveFloat: function(value) {
			value = parseFloat(value);
			return !isNaN(value) && value > 0;
		},
	}
}));
app.use(methodOverride());

var bikeRouter = require('./app/routes/bike');
var userRouter = require('./app/routes/user');
var bikeStationRouter = require('./app/routes/bike_station');

var userAuth = require('./app/middlewares/user_auth')({
	secret: config.jwt
});

// Routes are defined
app.use('/api/user', userRouter);
app.use('/api/bike', userAuth, bikeRouter);
app.use('/api/station', userAuth, bikeStationRouter);

app.use(function onError(err, req, res, next) {
	console.error(err);
	res.status(503).send({
		errors: err
	});
});
