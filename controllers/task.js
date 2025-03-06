const { Project, Task } = require('../models');

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
	addTask,
	updateTask,
};
