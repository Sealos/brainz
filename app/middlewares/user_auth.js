'use strict';

var jwt = require('jsonwebtoken');
var unless = require('express-unless');
var User = require('../models/user');
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
					errors: ['Invalid Authorization header']
				});
		} else
			return res.status(400).json({
				errors: ['Authorization header required']
			});

		// Decode the token
		jwt.verify(token, options.secret, options, function decodeJWT(err, decoded) {

			if (err)
				return res.status(401).json({
					errors: ['Error decoding token']
				});

			// Get the current user data
			var query = {
				email: decoded._id
			};

			User.findOne(query, function getUser(err, usr) {

				if (err)
					return res.status(503).send();

				if (usr === null) {
					return res.status(400).json({
						errors: ['Error decoding token']
					});
				}

				if (usr.password !== decoded.password) {
					return res.status(401).send({
						errors: ['Passwords do not match']
					});
				}

				req.user = usr;

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
