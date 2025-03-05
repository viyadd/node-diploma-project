const jwt = require('jsonwebtoken');

module.exports = {
	generate(data) {
		return jwt.sign(data, process.env.JWT_SIGN, { expiresIn: '30d' });
	},
	verify(token) {
		try {
			return jwt.verify(token, process.env.JWT_SIGN);
		} catch (e) {
			return {}
		}
	},
};
