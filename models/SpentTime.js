const mongoose = require('mongoose');

const SpentTimeSchema = mongoose.Schema(
	{
		startedAt: {
			type: String,
			required: true,
		},
		endedAt: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		task: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task',
		},
		executor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
);

const SpentTime = mongoose.model('SpentTime', SpentTimeSchema);

module.exports = SpentTime;
