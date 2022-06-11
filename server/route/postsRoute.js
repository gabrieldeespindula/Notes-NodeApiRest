const express = require('express');
const router = express.Router();
const postsService = require('../service/postsService');

// get all
router.get('/posts', async (req, res) => {
	const posts = await postsService.getPosts();
	res.json(posts);
});

// get by id
router.get('/posts/:id', async (req, res) => {

});

// insert
router.post('/posts', async (req, res) => {
	const post = req.body;
	const newPost = await postsService.savePost(post);
	res.json(newPost);
});

// update
router.put('/posts/:id', async (req, res) => {
	const post = req.body;
	await postsService.updatePost(req.params.id, post);
	res.end();
});

// delete
router.delete('/posts/:id', async (req, res) => {
	await postsService.deletePost(req.params.id);
	res.end();
});

module.exports = router;