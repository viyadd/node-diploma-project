const { sendErrorResponse } = require('../helpers');

module.exports = function (roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			sendErrorResponse(res, 'Access denied', 200);
			return;
		}

		next();
	};
};
