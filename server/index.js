const express = require('express');
const cors = require('cors');
const NotesRoute = require('./route/NotesRoute');
const UsersRoute = require('./route/UsersRoute');
const port = process.env.PORT || 3000;
/** Server launcher and general configuration */
class App {

	app;
	constructor() {
		this.app = express();
		this.app.use(cors());
		this.app.use(express.json());

		this.getRoutes();

		this.app.use(this.errorHandler);

		this.app.listen(port);
	}

	/** Fetch API routes */
	getRoutes() {
		const notesRoute = new NotesRoute();
		const usersRoute = new UsersRoute();

		this.app.use('/', notesRoute.getRoutes());
		this.app.use('/', usersRoute.getRoutes());
	}

	/** Error handling and returns */
	errorHandler(error, req, res, errorHandler) {
		if (error.message.indexOf('Authentication failed') > -1) {
			return res.status(401).send(error.message);
		}
		if (error.message.indexOf('already exists') > -1) {
			return res.status(409).send(error.message);
		}
		if (error.message.indexOf('not found') > -1) {
			return res.status(404).send(error.message);
		}
		if (error.message.indexOf('Missing parameter',) > -1) {
			return res.status(400).send(error.message);
		}
		return res.status(500).send(error.message);
	}
}

new App();