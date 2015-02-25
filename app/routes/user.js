'use strict';

// User routes use users controller
var express = require('express');
var user = require('../controllers/user');
var config = require('../config/config');
var userAuth = require('../middlewares/user_auth')({
	secret: config.jwt
});

function checkPermission(permission) {
	return function checkPermission(req, res, next) {
		var hasPermission = (req.user.permission & permission) > 0;

		if (hasPermission)
			next();
		else
			res.status(401).send();
	};
}

var isAdmin = checkPermission(config.permission.admin);

var router = express.Router();

router.post('/register', user.createUser);
router.post('/login', user.login);

router.use(userAuth, isAdmin);
router.put('/admin/permission', user.changeUserPermission);

module.exports = router;
