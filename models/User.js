const mongoose = require('mongoose');
const roles = require('../constants/roles');

const UserSchema = mongoose.Schema(
	{
		login: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			default: roles.GUEST,
		},
		isActive: {
			type: Boolean,
			default: true
		},
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		patronymic: {
			type: String,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
