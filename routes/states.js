const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const mapState = require('../helpers/mapState');
const ROLES = require('../constants/roles');
// const { verify } = require('../helpers/token');
// const { errorParser, sendErrorResponse } = require('../helpers');
const { getStates, updateState, deleteState, addState } = require('../controllers/state');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
	const states = await getStates();

	res.send({ data: states.map(mapState) });
});

router.post('/', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newState = await addState({
			code: req.body.code,
			text: req.body.text,
		});

		res.send({ error: null, state: mapState(newState) });
	} catch (e) {
		res.send({ error: e.message || 'Unknown error' });
	}
});

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	const newState = await updateState(req.params.id, {
		text: req.body.text,
	});

	res.send({ data: mapState(newState) });
});

router.delete('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	await deleteState(req.params.id);

	res.send({ error: null });
});

module.exports = router;
