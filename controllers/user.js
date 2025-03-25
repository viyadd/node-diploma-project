const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generate } = require('../helpers/token');
const ROLES = require('../constants/roles');
const { getExtendedError } = require('../helpers');

// register

async function register({ login, password, surname, name, patronymic }) {
	if (!password) {
		throw new Error('Password is empty');
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = await User.create({
		login,
		password: passwordHash,
		surname,
		name,
		patronymic,
	});
	const token = generate({ id: user.id });

	return { user, token };
}

// login

async function login(login, password) {
	const user = await User.findOne({ login });

	if (!user) {
		throw new Error('User not found');
	}

	const isPasswordMatch = await bcrypt.compare(password, user.password);

	if (!isPasswordMatch) {
		throw new Error('Wrong password');
	}

	const token = generate({ id: user.id });

	return { token, user };
}

async function getUsers() {
	const users = await User.find();

	// users.map((user) => {
	// 	// const sysRole = getRoles().find((role) => role.id === user.role) ?? null;
	// 	// user.sysRole = sysRole;
	// 	return user;
	// });
	return users
}

function getUser(id) {
	const user = User.findOne({ _id: id });
	if (user === null) {
		throw getExtendedError(`User ${id} not found`);
	}
	return user;
}

function getRoles() {
	return [
		{ id: ROLES.ADMIN, code: '01', text: 'Admin' },
		{ id: ROLES.USER, code: '02', text: 'User' },
		{ id: ROLES.GUEST, code: '03', text: 'Guest' },
	];
}

// delete

function deleteUser(id) {
	return User.deleteOne({ _id: id });
}

// edit

function updateUser(id, userData) {
	return User.findByIdAndUpdate(id, userData, { returnDocument: 'after' });
}

module.exports = {
	register,
	login,
	getUser,
	getUsers,
	getRoles,
	deleteUser,
	updateUser,
};
