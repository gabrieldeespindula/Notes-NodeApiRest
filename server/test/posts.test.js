const axios = require('axios');
const postsService = require('../service/postsService');
const crypto = require('crypto');
const { response } = require('express');
const { text } = require('body-parser');

const generate = (num = 20) => {
	return Math.random().toString(36).substring(0, num);
}

const request = (url, method, data) => {
	return axios({ url, method, data, validateStatus: false });
}

test('Get posts', async () => {
	const postsLength = parseInt((await postsService.getPosts()).length);
	const arrayPosts = [];
	for (let i = 1; i <= 3; i++) {
		let data = { title: generate(), content: generate() };
		let insertId = await postsService.savePost(data);
		arrayPosts.push(insertId);
	}
	const response = await request('http://localhost:3000/posts', 'get');
	expect(response.status).toBe(200);
	const posts = response.data;
	expect(posts).toHaveLength(postsLength + 3)
	arrayPosts.forEach(async (item) => {
		await postsService.deletePost(item.id);
	});
})

test('Insert post', async () => {
	const data = { title: generate(), content: generate() };
	const response = await request('http://localhost:3000/posts', 'post', data);
	expect(response.status).toBe(201);
	const post = response.data;
	expect(post.title).toBe(data.title);
	expect(post.content).toBe(data.content);
	await postsService.deletePost(post.id);
})

test('Post not inserted', async () => {
	const data = { title: generate(), content: generate() };
	const response1 = await request('http://localhost:3000/posts', 'post', data);
	const response2 = await request('http://localhost:3000/posts', 'post', data);
	expect(response2.status).toBe(409);
	const post = response1.data;
	await postsService.deletePost(post.id);
})

test('Update a post', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	post.title = generate();
	post.content = generate();
	const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
	expect(response.status).toBe(204);
	const updatedPost = await postsService.getPost(post.id);
	expect(updatedPost.title).toBe(post.title);
	expect(updatedPost.content).toBe(post.content);
	await postsService.deletePost(post.id);
})

test('Post not found', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	await postsService.deletePost(post.id);
	const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
	expect(response.status).toBe(404);
})

test('Delete a post', async () => {
	const postsLength = parseInt((await postsService.getPosts()).length);
	const post = await postsService.savePost({ title: generate(), content: generate() });
	const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');
	expect(response.status).toBe(204);
	const deletedPost = await postsService.getPosts();
	expect(deletedPost).toHaveLength(postsLength);
})