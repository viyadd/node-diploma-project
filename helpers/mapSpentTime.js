const parsingUser = require('./parsingUser');

module.exports = function (spentTime) {
	return {
		id: spentTime.id,
		comment: spentTime.comment,
		executor: parsingUser(spentTime.executor),
		startedAt: spentTime.startedAt,
		endedAt: spentTime.endedAt,
		createdAt: spentTime.createdAt,
	};
};
