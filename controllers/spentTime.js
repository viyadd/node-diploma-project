const { SpentTime, Task } = require('../models');

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

// edit
function updateSpentTime(id, spentTimeData) {
	return SpentTime.findByIdAndUpdate(id, spentTimeData, { returnDocument: 'after' });
}

module.exports = {
	addSpentTime,
	updateSpentTime,
};
