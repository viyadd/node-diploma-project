class NotAcceptable extends Error {
	status
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = message;
		this.status = 406
  }
}

function getExtendedError(message) {
	return new NotAcceptable(message)
}

module.exports = getExtendedError
