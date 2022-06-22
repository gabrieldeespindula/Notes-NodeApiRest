const Route = require('./Route');
const UsersService = require('../service/UsersService');
const environment = require('../environment/environment');

/** User routes */
module.exports = class NotesRoute extends Route {

	constructor() {
		super();
		this.setRoutes();
	}

	/** Use this function to set the routes */
	setRoutes() {
		const usersService = new UsersService();

		this.router.post('/users', async (req, res, errorHandler) => {
			const user = req.body;
			try {
				const newUser = await usersService.saveUser(user);
				res.status(201).json(newUser);
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.get('/users/test', async (req, res, errorHandler) => {
			try {
				res.status(200).json(environment);
			} catch (e) {
				res.status(200).json(e);
			}
		});

		this.router.put('/users', super.secure_user, async (req, res, errorHandler) => {
			const user = req.body;
			try {
				await usersService.updateUser(user.user_id, user);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});

		this.router.delete('/users', super.secure_user, async (req, res, errorHandler) => {
			const user_id = req.body.user_id;
			try {
				await usersService.deleteUser(user_id);
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
