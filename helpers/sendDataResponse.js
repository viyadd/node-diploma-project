module.exports = (res, data, code = 200) => {
	res.status(code).json({ error: null, data });
};
