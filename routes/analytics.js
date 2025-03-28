const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const {
	errorParser,
	sendErrorResponse,
	mapState,
	mapTask,
	mapProject,
	sendDataResponse,
} = require('../helpers');
const { getSpentTimeByIdList } = require('../controllers/spentTime');
const ALL_REGISTRED = require('../constants/all-registred');
const { getProject, getProjects } = require('../controllers/project');
const { PROJECT_PROJECTION, TASK_PROJECTION } = require('../constants');
const { getTasks } = require('../controllers/task');
const { getStates } = require('../controllers/state');

const router = express.Router({ mergeParams: true });

router.get('/project/:id', authenticated, hasRole(ALL_REGISTRED), async (req, res) => {
	try {
		const projectId = req.params.id;
		const project = await getProject(projectId, {
			projection: PROJECT_PROJECTION.SHORT_LIST,
		});
		const { tasks } = await getTasks({
			populateList: ['spentTimes'],
			limit: 999,
			idList: project.tasks,
		});

		const taskList = tasks.map(mapTask);

		taskList.forEach((task, i) => {
			const duration = task.spentTimes.reduce(
				(sum, spentTime) => sum + spentTime.duration,
				0,
			);
			taskList[i].spentTimeDuration = duration;
		});

		const states = await getStates();

		const statusList = states.map(mapState);
		statusList.forEach((status, i) => {
			const count = tasks.filter((task) => String(task.state._id) === status.id).length;
			statusList[i].count = count;
		});

		sendDataResponse(res, { taskList, statusList });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.get('/projects', authenticated, hasRole(ALL_REGISTRED), async (req, res) => {
	try {
		const projects = await getProjects({
			projection: PROJECT_PROJECTION.SHORT_LIST,
		});

		const states = await getStates();

		const stateList = states.map(mapState);
		stateList.forEach((status, i) => {
			const count = projects.filter(
				(project) => String(project.state._id) === status.id,
			).length;
			stateList[i].count = count;
		});

		sendDataResponse(res, stateList);
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
