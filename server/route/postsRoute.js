const express = require('express');
const PostsService = require('../service/PostsService');

/** Post routes */
module.exports = class PostsRoute {

	router;
	constructor() {
		this.router = express.Router();
		this.setRoutes();
	}

	/** Use this function to set the routes */
	setRoutes() {
		const postsService = new PostsService();
		this.router.get('/posts', async (req, res, errorHandler) => {
			try {
				const posts = await postsService.getPosts();
				res.status(200).json(posts);
			} catch (e) {
				errorHandler(e);
			}
		});

		// get by id
		this.router.get('/posts/:id', async (req, res) => {

		});

		// insert
		this.router.post('/posts', async (req, res, errorHandler) => {
			const post = req.body;
			try {
				const newPost = await postsService.savePost(post);
				res.status(201).json(newPost);
			} catch (e) {
				errorHandler(e);
			}
		});

		// update
		this.router.put('/posts/:id', async (req, res, errorHandler) => {
			const post = req.body;
			try {
				await postsService.updatePost(req.params.id, post);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});

		// delete
		this.router.delete('/posts/:id', async (req, res, errorHandler) => {
			try {
				await postsService.deletePost(req.params.id);
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