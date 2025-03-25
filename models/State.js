const mongoose = require('mongoose');

const StateSchema = mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const State = mongoose.model('state', StateSchema);

module.exports = State;
