'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Log = {
	action: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	estimatedReturn: {
		type: Date,
		required: false
	},
	comment: {
		type: String,
		required: true,
		default: ''
	},
	licensePlate: {
		type: String,
		required: true,
	},
};

var schema = new Schema({
	_id: {
		type: String,
		required: true,
		index: true,
		ref: 'user'
	},
	log: [Log]
});

module.exports = mongoose.model('user_log', schema);
