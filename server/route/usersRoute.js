const express = require('express');
const UsersService = require('../service/UsersService');
const usersService = new UsersService();

/** User routes */
module.exports = class PostsRoute {

	router;
	constructor() {
		this.router = express.Router();
		this.setRoutes();
	}

	/** Use this function to set the routes */
	setRoutes() {

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
	}

	/** return routes */
	getRoutes() {
		return this.router;
	}
}
