function testLogin(login) {
	if (typeof login !== 'string') {
		return [false];
	}
	const newLogin = login.trim().toLowerCase();
	return { isNotValid: newLogin < 1, login: newLogin };
}

module.exports = testLogin;
