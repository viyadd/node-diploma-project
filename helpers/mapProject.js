const { default: mongoose } = require("mongoose");
const mapState = require("./mapState");
const mapTask = require("./mapTask");
const parsingUser = require("./parsingUser");

module.exports = function (project) {
	return {
		id: project.id,
		title: project.title,
		description: project.description,
		state: mongoose.isObjectIdOrHexString(project.state) ? project.state : mapState(project.state),
		owner: parsingUser(project.owner),
		executor: parsingUser(project.executor),
		createdAt: project.createdAt,
		tasks: project.tasks.map((task) =>
			mongoose.isObjectIdOrHexString(task) ? task : mapTask(task)
		),
	};
};
