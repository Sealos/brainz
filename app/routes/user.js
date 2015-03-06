'use strict';

// User routes use users controller
var express = require('express');
var user = require('../controllers/user');
var config = require('../config/config');
var userAuth = require('../middlewares/user_auth')({
	secret: config.jwt
});
var userPermission = require('../middlewares/user_permission');

var isAdmin = userPermission(config.permission.admin);

var router = express.Router();

router.post('/register', user.createUser);
router.post('/login', user.login);

router.use(userAuth, isAdmin);
router.put('/admin/user/:userId/permission', user.changeUserPermission);
router.get('/admin/user/:userId/logs', user.getUserLog);

module.exports = router;
