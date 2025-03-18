const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const ROLES = require('../constants/roles');
const ALL_REGISTRED = require('../constants/all-registred');
const { errorParser, sendErrorResponse, mapSpentTime } = require('../helpers');
const { updateSpentTime, getSpentTimeList } = require('../controllers/spentTime');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
	try {
		const { id, search, limit, page, sort, orderBy } = req.query;
		const data = { idList: id, search, limit, page, sort, orderBy };
		const { spentTimeList, lastPage } = await getSpentTimeList(data);

		res.send({ data: { lastPage, content: spentTimeList.map(mapSpentTime) } });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.patch('/:id', authenticated, hasRole(ALL_REGISTRED), async (req, res) => {
	try {
		const newSpentTime = await updateSpentTime(req.params.id, {
			startedAt: req.body.startedAt,
			duration: req.body.duration,
			comment: req.body.comment,
		});

		res.send({ data: mapSpentTime(newSpentTime) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
