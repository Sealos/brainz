'use strict';

var jwt = require('jsonwebtoken');
var unless = require('express-unless');
var User = require('../models/user');
var Event = require('./analytic');
var config = require('../config/config');

/**
 * Middleware to incercept the Bearer <token> and check if it's valid
 *
 * This is based on the express-jwt
 * @param  {[type]} options Options for the token and user fields
 */
module.exports = function(options) {

	if (!options || !options.secret) {
		throw new Error('secret should be set');
	}

	// Build the function
	var middleware = function(req, res, next) {
		var token;

		if (req.headers && req.headers.authorization) {
			var parts = req.headers.authorization.split(' ');
			if (parts.length === 2) {
				var scheme = parts[0];
				var credentials = parts[1];

				if (/^Bearer$/.test(scheme)) {
					token = credentials;
				}
			} else
				return res.status(400).json({
					errors: 'Authorization header required'
				});
		} else
			return res.status(400).json({
				errors: 'Authorization header required'
			});

		// Decode the token
		jwt.verify(token, options.secret, options, function decodeJWT(err, decoded) {

			if (err)
				return res.status(409).send();

			// Get the current user data
			User.findById(decoded._id, function getUser(err, usr) {

				if (err)
					return res.status(503).send();

				if (!usr || usr.password !== decoded.password)
					return res.status(401).send();

				req.user = usr;

				var geoloc = req.headers['x-geolocation'];

				if (geoloc) {
					geoloc = geoloc.split(',');

					if (geoloc.length === 2) {
						usr.lastKnownLoc = geoloc;
						usr.hasGps = true;
					} else {
						return res.status(400).json({
							errors: 'Invalid x-geolocation header'
						});
					}

					req.user.location = geoloc;
				}

				/*var agent = req.headers['x-user-agent'];

				if (!agent)
					agent = req.headers['user-agent'];

				if (agent)
					Event.registerUserAgent(agent);
				else
					return res.status(400).json({
						errors: 'User-Agent header required'
					});*/

				// Update the user
				usr.lastAccess = Date.now();
				usr.apiVersion = config.apiVersion;
				usr.save(function saveUser(err) {
					if (err)
						return next(err);
					else
						next();
				});
			});
		});
	};

	middleware.unless = unless;

	return middleware;
};
