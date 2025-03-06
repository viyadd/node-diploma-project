const Project = require('../models/Project');

async function getProjects() {
	const projects = await Project.find();
	return await Promise.all(
		projects.map((project) =>
			project.populate([
				'state',
				'owner',
				'executor',
				{
					path: 'tasks',
					populate: 'spentTimes',
				},
			]),
		),
	);
}

async function getProject(id) {
	const project = await Project.findOne({ _id: id });

	await project.populate([
		'state',
		'owner',
		'executor',
		{
			path: 'tasks',
			populate: 'spentTimes',
		},
	]);

	return project;
}

async function addProject(project) {
	const newProject = await Project.create(project);

	await newProject.populate({
		path: ['state', 'tasks', 'owner', 'executor'],
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
