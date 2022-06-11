const axios = require('axios');
const postsService = require('../service/postsService');
const crypto = require('crypto');
const { response } = require('express');

const generate = () => {
	return crypto.randomBytes.toString('hex');
}

const request = (url, method, data) => {
	return axios({ url, method, data });
}

test('Get posts', async () => {
	// insert
	const arrayPosts = [];
	for (let i = 1; i <= 3; i++) {
		let insertId = await postsService.savePost({ title: generate(), content: generate() });
		arrayPosts.push(insertId);
	}
	// search
	const response = await request('http://localhost:3000/posts', 'get');
	const posts = response.data;
	// compare
	expect(posts).toHaveLength(3)
	// delete
	arrayPosts.forEach(async (item) => {
		await postsService.deletePost(item.id);
	});
})

test('Insert post', async () => {
	const data = { title: generate(), content: generate() };
	const response = await request('http://localhost:3000/posts', 'post', data);
	const post = response.data;
	expect(post.title).toBe(data.title);
	expect(post.content).toBe(data.content);
	await postsService.deletePost(post.id);
})

test('Update a post', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	post.title = generate();
	post.content = generate();
	await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
	const updatedPost = await postsService.getPost(post.id);
	expect(updatedPost.title).toBe(post.title);
	expect(updatedPost.content).toBe(post.content);
	await postsService.deletePost(post.id);
})

test('Delete a post', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	await request(`http://localhost:3000/posts/${post.id}`, 'delete');
	const deletedPost = await postsService.getPosts();
	expect(deletedPost).toHaveLength(0);
})