const Project = require('../models/Project');
const {PROJECT_PROJECTION} = require('../constants');

async function getProjects({ projection }) {
	const projects = await Project.find();
	if (projection!==PROJECT_PROJECTION.SHORT_LIST)
	await Promise.all(
		projects.map((project) =>
			project.populate([
				'state',
				'owner',
				'executor',
				// {
				// 	path: 'tasks',
				// 	populate: 'spentTimes',
				// },
			]),
		),
	);
	return projects;
}

async function getProject(id) {
	const project = await Project.findOne({ _id: id });

	await project.populate([
		'state',
		'owner',
		'executor',
		// {
		// 	path: 'tasks',
		// 	populate: 'spentTimes',
		// },
	]);

	return project;
}

async function addProject(project) {
	const newProject = await Project.create(project);

	await newProject.populate({
		path: ['state', /* 'tasks',  */ 'owner', 'executor'],
	});

	return newProject;
}

// edit
function updateProject(id, projectData) {
	return Project.findByIdAndUpdate(id, projectData, { returnDocument: 'after' });
}

module.exports = {
	getProjects,
	getProject,
	addProject,
	updateProject,
};
