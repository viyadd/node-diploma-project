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
		projec: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		executor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		state: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'State',
		},
	},
	{ timestamps: true },
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
