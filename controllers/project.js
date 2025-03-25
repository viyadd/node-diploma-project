const Project = require('../models/Project');
const { PROJECT_PROJECTION } = require('../constants');
const { getOrderByParam } = require('../helpers');
const { Task } = require('../models');

async function getProjects({ projection }) {
	const projects = await Project.find();
	if (projection !== PROJECT_PROJECTION.SHORT_LIST) {
		await Promise.all(
			projects.map((project) => project.populate(['state', 'owner', 'executor'])),
		);
	}
	return projects;
}

async function getFilteredProjects({
	projection,
	search = '',
	idList,
	limit = 10,
	page = 1,
	sort = 'createdAt',
	orderBy = 'asc',
}) {
	const orderByParam = getOrderByParam(orderBy);

	const idListObj = Array.isArray(idList) ? idList : [idList];

	const searchObj = idList
		? {
				_id: {
					$in: idListObj,
				},
		  }
		: { title: { $regex: search, $options: 'i' } };

	const obj = Task.schema.obj;

	const [projects, count] = await Promise.all([
		Project.find(searchObj)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ [Object.keys(obj).includes(sort) ? sort : 'createdAt']: orderByParam }),
		Project.countDocuments(searchObj),
	]);

	if (projection !== PROJECT_PROJECTION.SHORT_LIST) {
		await Promise.all(
			projects.map((project) => project.populate(['state', 'owner', 'executor'])),
		);
	}
	return {
		projects,
		lastPage: Math.ceil(count / limit),
	};
}

async function getProject(id, { projection } = {}) {
	const project = await Project.findOne({ _id: id });

	if (project === null) {
		throw getExtendedError(`Project ${id} not found`);
	}

	if (projection !== PROJECT_PROJECTION.SHORT_LIST) {
		await project.populate([
			'state',
			'owner',
			'executor',
			// {
			// 	path: 'tasks',
			// 	populate: 'spentTimes',
			// },
		]);
	}

	return project;
}

async function addProject(project) {
	const newProject = await Project.create(project);

	await newProject.populate(['state', 'owner', 'executor']);

	return newProject;
}

// edit
async function updateProject(id, projectData) {
	const newProject = await Project.findByIdAndUpdate(id, projectData, {
		returnDocument: 'after',
	});
	await newProject.populate(['state', 'owner', 'executor']);

	return newProject;
}

module.exports = {
	getFilteredProjects,
	getProjects,
	getProject,
	addProject,
	updateProject,
};
