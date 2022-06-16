const axios = require('axios');
const postsService = require('../service/postsService');
const environment = require('../environment/environment');
const { faker } = require('@faker-js/faker');

const request = (endpoint, method = 'get', data) => {
	const url = environment.url + endpoint;
	return axios({ url, method, data, validateStatus: false });
}

test('Get posts', async () => {
	const postsLength = parseInt((await postsService.getPosts()).length);
	const arrayPosts = [];
	for (let i = 1; i <= 3; i++) {
		let data = { title: faker.lorem.sentence(), content: faker.lorem.text() };
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
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text() };
	const response = await request('posts', 'post', data);
	expect(response.status).toBe(201);
	const post = response.data;
	expect(post.title).toBe(data.title);
	expect(post.content).toBe(data.content);
	await postsService.deletePost(post.id);
})

test('Insert post: Missing parameter: title', async () => {
	const data = { content: faker.lorem.text() };
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
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text() };
	const response1 = await request('posts', 'post', data);
	const response2 = await request('posts', 'post', data);
	expect(response2.status).toBe(409);
	const post = response1.data;
	await postsService.deletePost(post.id);
})

test('Update a post', async () => {
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text() });
	post.title = faker.lorem.sentence();
	post.content = faker.lorem.text();
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(204);
	const updatedPost = await postsService.getPost(post.id);
	expect(updatedPost.title).toBe(post.title);
	expect(updatedPost.content).toBe(post.content);
	await postsService.deletePost(post.id);
})

test('Update a post: Missing parameter: content', async () => {
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text() });
	const data = { title: faker.lorem.sentence() };
	const response = await request(`posts/${post.id}`, 'put', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: content');
	await postsService.deletePost(post.id);
})

test('Update a post: Not found', async () => {
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text() });
	await postsService.deletePost(post.id);
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(404);
})

test('Delete a post', async () => {
	const postsLength = parseInt((await postsService.getPosts()).length);
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text() });
	const response = await request(`posts/${post.id}`, 'delete');
	expect(response.status).toBe(204);
	const deletedPost = await postsService.getPosts();
	expect(deletedPost).toHaveLength(postsLength);
})

test('Delete a post: Not found', async () => {
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text() });
	await postsService.deletePost(post.id);
	const response = await request(`posts/${post.id}`, 'put', post);
	expect(response.status).toBe(404);
})