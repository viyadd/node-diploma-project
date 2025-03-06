const express = require('express');
const {
	getUsers,
	getRoles,
	updateUser,
	deleteUser,
	getUser,
} = require('../controllers/user');
const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const mapUser = require('../helpers/mapUser');
const ROLES = require('../constants/roles');
const { verify } = require('../helpers/token');
const { errorParser, sendErrorResponse } = require('../helpers');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	const users = await getUsers();

	res.send({ data: users.map(mapUser) });
});

router.get('/user', async (req, res) => {
	try {
		const { token } = req.cookies;
		if (typeof token !== 'string' || token.trim().length === 0) {
			console.log('>', req.cookies.token);
			sendErrorResponse(res, 'Unknown user', 401);
			return;
		}
		const tokenData = verify(req.cookies.token);
		if (tokenData.id === undefined) {
			sendErrorResponse(res, 'Unknown user', 401);
			return;
		}
		const user = await getUser(tokenData.id);

		res.send({ data: mapUser(user) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.get('/roles', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	const roles = getRoles();

	res.send({ data: roles });
});

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	const newUser = await updateUser(req.params.id, {
		role: req.body.roleId,
	});

	res.send({ data: mapUser(newUser) });
});

router.delete('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	await deleteUser(req.params.id);

	res.send({ error: null });
});

module.exports = router;
