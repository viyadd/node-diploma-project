module.exports = function (user) {
	return {
		id: user.id,
		login: user.login,
		surname: user.surname,
		name: user.name,
		patronymic: user.patronymic,
		roleId: user.role,
		registredAt: user.createdAt,
	};
};
