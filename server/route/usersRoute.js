const Route = require('./Route');
const UsersService = require('../service/UsersService');

/** User routes */
module.exports = class PostsRoute extends Route {

	constructor() {
		super();
		this.setRoutes();
	}

	/** Use this function to set the routes */
	setRoutes() {
		const usersService = new UsersService();
		this.router.get('/users', async (req, res, errorHandler) => {
			try {
				const users = await usersService.getUsers();
				res.status(200).json(users);
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.post('/users', async (req, res, errorHandler) => {
			const post = req.body;
			try {
				const newUser = await usersService.saveUser(post);
				res.status(201).json(newUser);
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.put('/users/:id', async (req, res, errorHandler) => {
			const post = req.body;
			try {
				await usersService.updateUser(req.params.id, post);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.delete('/users/:id', async (req, res, errorHandler) => {
			try {
				await usersService.deleteUser(req.params.id);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.post('/users/login', async (req, res, errorHandler) => {
			const login = req.body;
			try {
				const verifyUser = await usersService.login(login);
				res.status(200).json(verifyUser);
			} catch (e) {
				errorHandler(e);
			}
		});
	}

	/** return routes */
	getRoutes() {
		return this.router;
	}
}
