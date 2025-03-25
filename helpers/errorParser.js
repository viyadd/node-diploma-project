module.exports = function (error) {
	const { code, errmsg } = error?.errorResponse ?? {};
	const { _message, status } = error;

	if (status === 406) {
		return { statusCode: status, error: error.message };
	}

	const statusCode = _message || code === 11000 ? 400 : 500;
	// if (statusCode === 400) {
	// }
	const { message } = error;
	console.log('>>', { errmsg, _message, message, error });
	return {
		statusCode,
		error: _message || (errmsg && { code, message: errmsg }) || 'Unknown error',
	};
};
