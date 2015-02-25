'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	root: rootPath,
	db: 'mongodb://admin:admin@ds045011.mongolab.com:45011/brainz',
	app: {
		name: 'Ruedala Brainz'
	},
	port: process.env.PORT || 80,
	hostname: process.env.HOST || process.env.HOSTNAME,
	jwt: 'y4A8svIZ9oVwHGaoYXOA',
	apiVersion: 0.1,
	permission: {
		greasemonkey: 2,
		technician: 4,
		operator: 8,
		admin: 16,
	}
};
