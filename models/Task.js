const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema(
	{
		codeName: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		executor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
		state: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'state',
		},
		expectedSpentTime: {
			type: Number,
		},
		spentTimes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'spent_time',
		}],
	},
	{ timestamps: true },
);

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;
