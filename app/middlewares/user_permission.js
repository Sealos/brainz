'use strict';

var jwt = require('jsonwebtoken');
var unless = require('express-unless');
var User = require('../models/user');
var config = require('../config/config');

module.exports = function checkPermission(permission) {
	return function checkPermission(req, res, next) {
		var hasPermission = (req.user.permission & permission) > 0;

		if (hasPermission)
			next();
		else
			res.status(401).json({
				errors: ['Unauthorized']
			});
	};
};
