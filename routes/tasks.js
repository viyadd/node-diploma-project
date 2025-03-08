const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const ROLES = require('../constants/roles');
const { errorParser, sendErrorResponse, mapTask, mapSpentTime } = require('../helpers');
const { getTask, updateTask, getTasks } = require('../controllers/task');
const { addSpentTime } = require('../controllers/spentTime');

const router = express.Router({ mergeParams: true });

router.get(
	'/:id',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.USER]),
	async (req, res) => {
		try {
			const task = await getTask(req.params.id);

			res.send({ data: mapTask(task) });
		} catch (e) {
			const { error, statusCode } = errorParser(e);
			sendErrorResponse(res, error, statusCode);
		}
	},
);

router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
	try {
		const { id, search, limit, page, sort, orderBy } = req.query;
		const data = { idList: id, search, limit, page, sort, orderBy };
		const { tasks, lastPage } = await getTasks(data);

		res.send({ data: { lastPage, content: tasks.map(mapTask) } });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.post(
	'/:id/spent-time',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.USER]),
	async (req, res) => {
		try {
			const newSpentTime = await addSpentTime(req.params.id, {
				startedAt: req.body.startedAt,
				endedAt: req.body.endedAt,
				comment: req.body.comment,
				executor: req.user.id,
			});

			res.send({ error: null, content: mapSpentTime(newSpentTime) });
		} catch (e) {
			const { error, statusCode } = errorParser(e);
			sendErrorResponse(res, error, statusCode);
		}
	},
);

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newTask = await updateTask(req.params.id, {
			codeName: req.body.codeName,
			title: req.body.title,
			description: req.body.description,
			owner: req.body.owner,
			executor: req.body.executor,
			state: req.body.state,
		});

		res.send({ data: mapTask(newTask) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
