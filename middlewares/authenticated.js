const User = require('../models/User');
const { verify } = require('../helpers/token');
const { sendErrorResponse } = require('../helpers');

module.exports = async function (req, res, next) {
	const tokenData = verify(req.cookies.token);

	const user = await User.findOne({ _id: tokenData.id });

	if (!user) {
		sendErrorResponse(res, 'Authenticated user not found', 200);
		return;
	}

	req.user = user;

	next();
};
