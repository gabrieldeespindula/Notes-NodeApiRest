const express = require('express');
const PostsRoute = require('./route/PostsRoute');
const UsersRoute = require('./route/UsersRoute');

class App {

	app;
	constructor() {
		this.app = express();
		this.app.use(express.json());

		this.getRoutes();

		this.app.use(this.errorHandler);

		this.app.listen(3000);
	}

	getRoutes() {
		const postsRoute = new PostsRoute(express);
		const usersRoute = new UsersRoute(express);

		this.app.use('/', postsRoute.getRoutes());
		this.app.use('/', usersRoute.getRoutes());
	}

	errorHandler(error, req, res, next) {
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