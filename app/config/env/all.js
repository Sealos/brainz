'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	root: rootPath,
	db: 'mongo',
	app: {
		name: 'Ruedala Brainz'
	},
	port: process.env.PORT || 80,
	hostname: process.env.HOST || process.env.HOSTNAME,
	jwt: 'ruedalaBrainz',
	apiVersion: 0.1,
};
