const { default: mongoose } = require('mongoose');
const mapState = require('./mapState');
const mapTask = require('./mapTask');
const parsingUser = require('./parsingUser');
const { PROJECT_PROJECTION } = require('../constants');

module.exports = function (project, projection) {
	if (projection === PROJECT_PROJECTION.SHORT_LIST) {
		return {
			id: project.id,
			title: project.title,
			description: project.description,
			tasks: project.tasks,
		};
	}
	return {
		id: project.id,
		title: project.title,
		description: project.description,
		state: mongoose.isObjectIdOrHexString(project.state)
			? project.state
			: mapState(project.state),
		owner: parsingUser(project.owner),
		executor: parsingUser(project.executor),
		createdAt: project.createdAt,
		tasks: project.tasks.map((task) =>
			mongoose.isObjectIdOrHexString(task) ? task : mapTask(task),
		),
	};
};
