'use strict';

// Module dependencies.
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../models/user');
var _ = require('lodash');
var crypto = require('crypto');

function createToken(_id, password) {
	return jwt.sign({
		_id: _id,
		password: password,
		date: Date.now()
	}, config.jwt);
}

exports.createUser = function(req, res, next) {
	req.checkBody('idDocument', 'idDocument is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty().isEmail();
	req.checkBody('dayOfBirth', 'dayOfBirth is required').notEmpty();
	req.checkBody('monthOfBirth', 'monthOfBirth is required').notEmpty();
	req.checkBody('yearOfBirth', 'yearOfBirth is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var email = req.body.email.toLowerCase();
	// TODO(sdecolli): verify idDocument format.
	var dob = new Date(req.body.monthOfBirth + '-' + req.body.dayOfBirth + '-' + req.body.yearOfBirth);
	if (dob === false)
		return res.status(400).json({
			errors: 'Invalid date'
		});

	var user = new User({
		_id: req.body.idDocument,
		email: req.body.email,
		dateOfBirth: dob,
		password: req.body.password
	});

	user.save(function saveUser(err) {
		if (err)
			return next(err);

		var token = createToken(email, req.body.password);

		return res.status(200).json({
			token: token
		});
	});

};

exports.login = function(req, res, next) {
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		email: req.body.email,
	};

	User.findOne(query, function getUser(err, user) {
		if (err)
			return next(err);

		if (!user)
			return res.status(404).json({
				errors: 'Invalid username or password'
			});
		if (user.auth(req.body.password)) {
			var token = createToken(req.body.email, req.body.password);

			return res.status(200).json({
				token: token
			});
		} else {
			return res.status(400).json({
				errors: 'Invalid username or password'
			});
		}
	});
};

exports.changeUserPermission = function(req, res, next) {
	req.checkBody('permission', 'permission is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	if (req.body.permission < 0) 
		return res.status(400).json({
			errors: 'Permission must be greater than 0'
		});

	var query = {
		email: req.body.email,
	};

	var update = {
		permission: req.body.permission
	};

	User.findOne(query, function getUser(err, user) {
		if (err)
			return next(err);

		if (!user)
			return res.status(404).json({
				errors: 'Invalid username or password'
			});
		if (user.auth(req.body.password)) {
			var token = createToken(req.body.email, req.body.password);

			return res.status(200).json({
				token: token
			});
		} else {
			return res.status(400).json({
				errors: 'Invalid username or password'
			});
		}
	});
};
