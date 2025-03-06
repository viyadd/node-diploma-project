const State = require('../models/State');

async function getStates() {
	return State.find();
}

function getState(id) {
	return State.findOne({ _id: id });
}

function addState(state) {
	return State.create(state);
}

// edit
function updateState(id, stateData) {
	return State.findByIdAndUpdate(id, stateData, { returnDocument: 'after' });
}

function deleteState(id) {
	return State.deleteOne({ _id: id });
}

module.exports = {
	getStates,
	getState,
	addState,
	updateState,
	deleteState,
};
