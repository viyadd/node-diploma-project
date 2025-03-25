const { getOrderByParam, getExtendedError } = require('../helpers');
const { SpentTime, Task } = require('../models');

async function getSpentTimeList({
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
		: { title: { $regex: search ?? '', $options: 'i' } };

	const obj = SpentTime.schema.obj;
	const [spentTimeList, count] = await Promise.all([
		SpentTime.find(searchObj)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ [Object.keys(obj).includes(sort) ? sort : 'createdAt']: orderByParam }),
		SpentTime.countDocuments(searchObj),
	]);

	await Promise.all(spentTimeList.map((spentTime) => spentTime.populate(['executor'])));

	return {
		spentTimeList,
		lastPage: Math.ceil(count / limit),
	};
}

async function getSpentTimeByIdList({ idList, sort = 'createdAt', orderBy = 'asc' }) {
	const orderByParam = getOrderByParam(orderBy);

	const idListObj = Array.isArray(idList) ? idList : [idList];

	const searchObj = {
		_id: {
			$in: idListObj,
		},
	};
	console.log(searchObj)

	const obj = SpentTime.schema.obj;
	const spentTimeList = await SpentTime.find(searchObj).sort({
		[Object.keys(obj).includes(sort) ? sort : 'createdAt']: orderByParam,
	});

	return spentTimeList;
}

async function addSpentTime(taskId, spentTimeData) {
	const newSpentTime = await SpentTime.create(spentTimeData);

	await newSpentTime.populate({
		path: 'executor',
	});

	await Task.findByIdAndUpdate(taskId, {
		$push: {
			spentTimes: newSpentTime,
		},
	});

	return newSpentTime;
}

async function updateSpentTime(id, spentTimeData) {
	const newSpentTime = await SpentTime.findByIdAndUpdate(id, spentTimeData, {
		returnDocument: 'after',
	});
	if (newSpentTime === null) {
		throw getExtendedError(`SpemtTime ${id} not found`);
	}
	await newSpentTime.populate({
		path: ['executor'],
	});
	return newSpentTime;
}

function deleteSpentTime(id) {
	return SpentTime.deleteOne({ _id: id });
}

module.exports = {
	getSpentTimeByIdList,
	getSpentTimeList,
	addSpentTime,
	updateSpentTime,
	deleteSpentTime,
};
