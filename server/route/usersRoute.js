const UsersService = require('../service/UsersService');
const usersService = new UsersService();

module.exports = class PostsRoute {

	router;
	constructor(express) {
		this.router = express.Router();
		this.setRoutes();
	}

	setRoutes() {
		// get all
		this.router.get('/users', async (req, res) => {
			try {
				const users = await usersService.getUsers();
				res.status(200).json(users);
			} catch (e) {
				next(e);
			}
		});

		// get by id
		this.router.get('/users/:id', async (req, res) => {

		});

		// insert
		this.router.post('/users', async (req, res, next) => {
			const post = req.body;
			try {
				const newUser = await usersService.saveUser(post);
				res.status(201).json(newUser);
			} catch (e) {
				next(e);
			}
		});

		// update
		this.router.put('/users/:id', async (req, res, next) => {
			const post = req.body;
			try {
				await usersService.updateUser(req.params.id, post);
				res.status(204).end();
			} catch (e) {
				next(e);
			}
		});

		// delete
		this.router.delete('/users/:id', async (req, res) => {
			try {
				await usersService.deleteUser(req.params.id);
				res.status(204).end();
			} catch (e) {
				next(e);
			}
		});
	}

	getRoutes() {
		return this.router;
	}
}
