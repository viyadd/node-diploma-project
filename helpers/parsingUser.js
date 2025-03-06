const mongoose = require('mongoose');
const mapUser = require('./mapUser');

module.exports = function parsingUser(user) {
	if (!user) {
		return null;
	}

	return mongoose.isObjectIdOrHexString(user) ? user : mapUser(user);
};
