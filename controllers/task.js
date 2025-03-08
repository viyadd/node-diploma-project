const mongoose = require('mongoose');
const { getOrderByParam } = require('../helpers');
const { Project, Task } = require('../models');

async function getTasks({
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
	const [tasks, count] = await Promise.all([
		Task.find(searchObj)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ [Object.keys(obj).includes(sort) ? sort : 'createdAt']: orderByParam }),
		Task.countDocuments(searchObj),
	]);

	await Promise.all(
		tasks.map((task) =>
			task.populate([
				'state',
				'owner',
				'executor',
			]),
		),
	);

	return {
		tasks,
		lastPage: Math.ceil(count / limit),
	};
}

async function getTask(id) {
	const newTask = await Task.findOne({ _id: id });

	await newTask.populate([
		'state',
		'owner',
		'executor',
		{
			path: 'spentTimes',
			populate: 'executor',
		},
	]);

	return newTask;
}

async function addTask(projectId, taskData) {
	const newTask = await Task.create(taskData);

	await newTask.populate({
		path: ['state', 'owner', 'executor'],
	});

	await Project.findByIdAndUpdate(projectId, {
		$push: {
			tasks: newTask,
		},
	});

	return newTask;
}

function updateTask(id, taskData) {
	return Task.findByIdAndUpdate(id, taskData, { returnDocument: 'after' });
}

module.exports = {
	getTask,
	getTasks,
	addTask,
	updateTask,
};
