const mongoose = require('mongoose');
const mapState = require('./mapState');
const parsingUser = require('./parsingUser');
const mapSpentTime = require('./mapSpentTime');

module.exports = function (task) {
	return {
		id: task.id,
		codeName: task.codeName,
		title: task.title,
		description: task.description,
		expectedSpentTime: task.expectedSpentTime,
		project: task.project,
		owner: parsingUser(task.owner),
		executor: parsingUser(task.executor),
		state: mongoose.isObjectIdOrHexString(task.state) ? task.state : mapState(task.state),
		createdAt: task.createdAt,
		spentTimes: task.spentTimes.map((spentTime) => mongoose.isObjectIdOrHexString(spentTime)
			? spentTime
			: mapSpentTime(spentTime)),
	};
};
