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
		state: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'State',
			},
		],
	},
	{ timestamps: true },
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
