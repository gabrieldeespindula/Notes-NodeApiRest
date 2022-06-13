const axios = require('axios');
const postsService = require('../service/postsService');
const crypto = require('crypto');
const { response } = require('express');
const { text } = require('body-parser');
const environment = require('../environment/environment');

const generate = (num = 20) => {
	return Math.random().toString(36).substring(0, num);
}

const request = (endpoint, method = 'get', data) => {
	const url = environment.url + endpoint;
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
	const response = await request('posts');
	expect(response.status).toBe(200);
	const posts = response.data;
	expect(posts).toHaveLength(postsLength + 3);
	arrayPosts.forEach(async (item) => {
		await postsService.deletePost(item.id);
	});
})

test('Insert post', async () => {
	const data = { title: generate(), content: generate() };
	const response = await request('posts', 'post', data);
	expect(response.status).toBe(201);
	const post = response.data;
	expect(post.title).toBe(data.title);
	expect(post.content).toBe(data.content);
	await postsService.deletePost(post.id);
})

test('Insert post: Missing parameter: title', async () => {
	const data = { content: generate() };
	const response = await request('posts', 'post', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: title');
})

test('Insert post: Missing parameters: [title, content]', async () => {
	const data = {};
	const response = await request('posts', 'post', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameters: [ title, content ]');
})

test('Insert post: Post already exists', async () => {
	const data = { title: generate(), content: generate() };
	const response1 = await request('posts', 'post', data);
	const response2 = await request('posts', 'post', data);
	expect(response2.status).toBe(409);
	const post = response1.data;
	await postsService.deletePost(post.id);
})

test('Update a post', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	post.title = generate();
	post.content = generate();
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(204);
	const updatedPost = await postsService.getPost(post.id);
	expect(updatedPost.title).toBe(post.title);
	expect(updatedPost.content).toBe(post.content);
	await postsService.deletePost(post.id);
})

test('Update a post: Missing parameter: content', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	const data = { title: generate() };
	const response = await request(`posts/${post.id}`, 'put', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: content');
	await postsService.deletePost(post.id);
})

test('Update a post: Not found', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	await postsService.deletePost(post.id);
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(404);
})

test('Delete a post', async () => {
	const postsLength = parseInt((await postsService.getPosts()).length);
	const post = await postsService.savePost({ title: generate(), content: generate() });
	const response = await request(`posts/${post.id}`, 'delete');
	expect(response.status).toBe(204);
	const deletedPost = await postsService.getPosts();
	expect(deletedPost).toHaveLength(postsLength);
})

test('Delete a post: Not found', async () => {
	const post = await postsService.savePost({ title: generate(), content: generate() });
	await postsService.deletePost(post.id);
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(404);
})