const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const ROLES = require('../constants/roles');
const {
	errorParser,
	sendErrorResponse,
	mapProject,
	mapTask,
	sendDataResponse,
} = require('../helpers');
const {
	getProject,
	getProjects,
	addProject,
	updateProject,
	getFilteredProjects,
} = require('../controllers/project');
const { addTask } = require('../controllers/task');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
	const { projection, id, search, limit, page, sort, orderBy } = req.query;
	const isFiltered = [id, search, limit, page, sort, orderBy].filter(Boolean).length > 0;
	const projectsData = isFiltered
		? await getFilteredProjects({
				projection,
				idList: id,
				search,
				limit,
				page,
				sort,
				orderBy,
		  })
		: await getProjects({ projection });

	if (isFiltered) {
		const { projects, lastPage } = projectsData;
		sendDataResponse(res, { lastPage, content: projects.map(mapProject) });
	} else {
		sendDataResponse(
			res,
			projectsData.map((project) => mapProject(project, projection)),
		);
	}
});

router.get(
	'/:id',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.USER]),
	async (req, res) => {
		try {
			const project = await getProject(req.params.id);

			sendDataResponse(res, mapProject(project));
		} catch (e) {
			const { error, statusCode } = errorParser(e);
			sendErrorResponse(res, error, statusCode);
		}
	},
);

router.post('/:id/tasks', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newTask = await addTask(req.params.id, {
			codeName: req.body.codeName,
			title: req.body.title,
			description: req.body.description,
			expectedSpentTime: req.body.expectedSpentTime,
			owner: req.user.id,
			state: req.body.state,
		});

		sendDataResponse(res, mapTask(newTask));
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.post('/', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newProject = await addProject({
			title: req.body.title,
			description: req.body.description,
			state: req.body.state,
			owner: req.user.id,
		});

		// sendDataResponse(res, mapProject(newProject))
		res.send({ error: null, project: mapProject(newProject) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
	try {
		const newProject = await updateProject(req.params.id, {
			title: req.body.title,
			description: req.body.description,
			state: req.body.state,
		});

		sendDataResponse(res, mapProject(newProject));
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
