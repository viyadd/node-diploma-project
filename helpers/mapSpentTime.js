const parsingUser = require('./parsingUser');

module.exports = function (spentTime) {
	return {
		id: spentTime.id,
		comment: spentTime.comment,
		executor: parsingUser(spentTime.executor),
		startedAt: spentTime.startedAt,
		duration: spentTime.duration,
		createdAt: spentTime.createdAt,
	};
};
