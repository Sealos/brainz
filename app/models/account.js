'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.Types.ObjectId;

var Schema = new schema({
	_id: {
		type: String,
		required: true,
		unique: true
	},
	name: { type: String, required: true },
	address: { type: String },
	imgUrl: { type: String },
	distance: { type: String },
	active: { type: Boolean },
	color: { type: String }
},{
	collection: 'accounts'
});

module.exports = mongoose.model('account', Schema);
