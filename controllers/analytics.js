const mongoose = require('mongoose');
const { getOrderByParam, getExtendedError } = require('../helpers');
const { Project, Task, SpentTime } = require('../models');
const { getSpentTimeByIdList } = require('./spentTime');

async function getProjectAnalysis({
	// search = '',
	// idList,
	projectId,
	limit = 10,
	page = 1,
	sort = 'createdAt',
	orderBy = 'asc',
}) {
	const project = await Project.findOne({ _id: projectId });

	if (project === null) {
		throw getExtendedError(`Project ${id} not found`);
	}

	const orderByParam = getOrderByParam(orderBy);

	// const idListObj = project.tasks

	const searchObj = {
		_id: {
			$in: project.tasks,
		},
	};

	const obj = Task.schema.obj;
	const [tasks, allTasksFound] = await Promise.all([
		Task.find(searchObj)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ [Object.keys(obj).includes(sort) ? sort : 'createdAt']: orderByParam }),
		Task.find(searchObj),
	]);

	// await Promise.all(tasks.map((task) => task.populate(['state', 'owner', 'executor'])));
	const spentTimeIds = await allTasksFound.flatMap((task) =>
		task.spentTimes.map((spentTime) => spentTime._id),
	);
	// console.log(spentTimeIds, Array.isArray(spentTimeIds));
	const data = { idList: spentTimeIds, /* search, limit, page, sort, orderBy */ };
	const spentTimeList = await getSpentTimeByIdList(data);
	// console.log(spentTimeList, lastPage);
	// const sO = { _id: { in: spentTimeIds } };
	// const spentTimeList = await SpentTime.find();

	const count = allTasksFound.length;

	return {
		tasks,
		result: { spentTimeList },
		lastPage: Math.ceil(count / limit),
	};
}

async function getSpentTime({id}) {
	const newSpentTime = await SpentTime.find({ _id: {
		in: [ id] // mongoose.Types.ObjectId.isValid
	} });
	if (newSpentTime === null) {
		throw getExtendedError(`SpentTime ${id} not found`);
	}
	return newSpentTime
}

module.exports = {
	getProjectAnalysis,
	getSpentTime
};
