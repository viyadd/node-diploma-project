const express = require('express');

const hasRole = require('../middlewares/hasRole');
const authenticated = require('../middlewares/authenticated');
const ROLES = require('../constants/roles');
const { errorParser, sendErrorResponse, mapProject, mapTask } = require('../helpers');
const {
	getProject,
	getProjects,
	addProject,
} = require('../controllers/project');
const { addTask } = require('../controllers/task');

const router = express.Router({ mergeParams: true });

router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.USER]), async (req, res) => {
	const projects = await getProjects();

	res.send({ data: projects.map(mapProject) });
});

router.get(
	'/:id',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.USER]),
	async (req, res) => {
		try {
			const project = await getProject(req.params.id);

			res.send({ data: mapProject(project) });
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
			owner: req.user.id,
			state: req.body.state,
		});

		res.send({ data: mapTask(newTask) });
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
			owner: req.user.id
		});

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

		res.send({ data: mapProject(newProject) });
	} catch (e) {
		const { error, statusCode } = errorParser(e);
		sendErrorResponse(res, error, statusCode);
	}
});

module.exports = router;
