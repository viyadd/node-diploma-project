module.exports = function (error) {
	const { code, errmsg } = error?.errorResponse ?? {};
	const { _message } = error;

	const statusCode = _message || code === 11000 ? 400 : 500;
	// if (statusCode === 400) {
	// }
	// console.log('>', { errmsg, _message, error });
	return {
		statusCode,
		error: _message || (errmsg && { code, message: errmsg }) || 'Unknown error',
	};
};
