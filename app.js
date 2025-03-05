require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const port = 3009;
const app = express();

// app.use(express.static(path.resolve('..', 'react-diploma-project-t', 'dist')));

app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', routes);

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve('..', 'react-diploma-project-t', 'dist', 'index.html'));
// });

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
});
