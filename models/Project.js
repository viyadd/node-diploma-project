const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		tasks: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'task',
		}],
		state: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'state',
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
	},
	{ timestamps: true },
);

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
