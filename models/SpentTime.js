const mongoose = require('mongoose');

const SpentTimeSchema = mongoose.Schema(
	{
		startedAt: {
			type: Date,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		executor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
	},
	{ timestamps: true },
);

const SpentTime = mongoose.model('spent_time', SpentTimeSchema);

module.exports = SpentTime;
