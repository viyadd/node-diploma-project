const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const ROLES = require('../constants/roles');
const { errorParser, sendErrorResponse, mapSpentTime } = require('../helpers');
const { updateSpentTime } = require('../controllers/spentTime');

const router = express.Router({ mergeParams: true });

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newSpentTime = await updateSpentTime(req.params.id, req.user.id, {
			startedAt: req.body.startedAt,
			endedAt: req.body.endedAt,
			comment: req.body.comment,
		});

		res.send({ data: mapSpentTime(newSpentTime) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
