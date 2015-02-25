'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../config/config');

var Address = {
	line: { type: String },
	city: { type: String },
	state: { type: String },
};

var Devices = {
	agent: { type: String },
	token: { type: String },
	_id: false
};

var Name = {
	first: { type: String },
	last: { type: String },
};

var userSchema = new schema({
	_id: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	address: {
		type: Address,
		default: {
			line: '',
			city: '',
			state: '',
		}
	},
	appVersion: { type: String },
	apiVersion: { type: Number, default: config.apiVersion },
	dateOfBirth: { type: Date },
	gender: { type: String },
	lastAccess: {
		type: Date,
		default: Date.now()
	},
	mobilePhone: [String],
	name: {
		type: Name,
		default: {
			first: '',
			last: ''
		}
	},
	password: {
		type: String,
		default: '',
		required: true
	},
	registerDate: {
		type: Date,
		default: Date.now(),
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	lastUserAgent: {
		type: String,
		default: '',
		required: true
	},
	permission: {
		type: Number,
		default: 0,
		required: true
	},
	lastKnownLoc: [Number],
	devices: [Devices],
},{
	versionKey: false
});

userSchema.pre('save', function beforeSave(next) {
	var user = this;

	if (!user.isModified('password'))
		return next();

	user.salt = user.makeSalt();
	user.password = user.hashPassword(user.password);

	return next();
});

userSchema.methods = {

	auth: function(password) {
		return this.hashPassword(password) === this.password;
	},

	hashPassword: function(password) {
		var hash = crypto.createHash('SHA512').update(password + this.salt).digest('hex');
		return hash;
	},

	makeSalt: function() {
		return crypto.randomBytes(16).toString('hex');
	},

	isAdmin: function() {
		return (this.permission & config.permission.admin) > 0;
	},

	/*isOperator: function() {
		return (this.permission & config.permission.operator) > 0;
	},*/
};

module.exports = mongoose.model('user', userSchema);
