const axios = require('axios');
const PostsService = require('../service/PostsService');
const UsersService = require('../service/UsersService');
const environment = require('../environment/environment');
const { faker } = require('@faker-js/faker');
const Util = require('../libs/Util');

const postsService = new PostsService();
const usersService = new UsersService();

const request = (endpoint, method = 'get', data, token = null) => {
	const url = environment.url + endpoint;
	const headers = token != null ? { Authorization: `Bearer ${token}` } : {};
	return axios({ url, method, data, validateStatus: false, headers });
}

const createUser = async () => {
	const password = faker.internet.password();
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: password };
	const user = await usersService.saveUser(data);
	user.password = password;
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	return user;
}

const deleteUser = async (id) => {
	await usersService.deleteUser(id);
}

test('Get posts', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const postsLength = parseInt((await postsService.getPosts(user.id)).length);
	const arrayPosts = [];
	for (let i = 1; i <= 3; i++) {
		const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id };
		const insertId = await postsService.savePost(data);
		arrayPosts.push(insertId);
	}
	for (let i = 1; i <= 3; i++) {
		const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user2.id };
		const insertId = await postsService.savePost(data);
		arrayPosts.push(insertId);
	}
	const response = await request('posts', 'get', {}, user.token);
	expect(response.status).toBe(200);
	const posts = response.data;
	expect(posts).toHaveLength(postsLength + 3);
	arrayPosts.forEach(async (item) => {
		await postsService.deletePost(item.id, item.user_id);
	});
	await deleteUser(user.id);
	await deleteUser(user2.id);
})

test('Insert post', async () => {
	const user = await createUser();
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text() };
	const response = await request('posts', 'post', data, user.token);
	expect(response.status).toBe(201);
	const post = response.data;
	expect(post.title).toBe(data.title);
	expect(post.content).toBe(data.content);
	await postsService.deletePost(post.id, user.id);
	await deleteUser(user.id);
})

test('Insert post: Missing parameter: title', async () => {
	const user = await createUser();
	const data = { content: faker.lorem.text(), user_id: user.id };
	const response = await request('posts', 'post', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: title');
	await deleteUser(user.id);
})

test('Insert post: Missing parameters: [title, content]', async () => {
	const user = await createUser();
	const data = {};
	const response = await request('posts', 'post', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameters: [ title, content ]');
	await deleteUser(user.id);
})

test('Insert post: Post already exists', async () => {
	const user = await createUser();
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id };
	const response1 = await request('posts', 'post', data, user.token);
	const response2 = await request('posts', 'post', data, user.token);
	expect(response2.status).toBe(409);
	const post = response1.data;
	await postsService.deletePost(post.id, user.id);
	await deleteUser(user.id);
})

test('Update a post', async () => {
	const user = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	post.title = faker.lorem.sentence();
	post.content = faker.lorem.text();
	const response = await request(`posts/${post.id}`, 'put', post, user.token);
	expect(response.status).toBe(204);
	const updatedPost = await postsService.getPost(post.id);
	expect(updatedPost.title).toBe(post.title);
	expect(updatedPost.content).toBe(post.content);
	await postsService.deletePost(post.id, user.id);
	await deleteUser(user.id);
})

test('Update a post: Missing parameter: content', async () => {
	const user = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const data = { title: faker.lorem.sentence() };
	const response = await request(`posts/${post.id}`, 'put', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: content');
	await postsService.deletePost(post.id, user.id);
	await deleteUser(user.id);
})

test('Update a post: Not found', async () => {
	const user = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await postsService.deletePost(post.id, user.id);
	const response = await request(`posts/${post.id}`, 'put', post, user.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
})

test('Update a post: Not found (Belongs to another user)', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await postsService.deletePost(post.id, user.id);
	const response = await request(`posts/${post.id}`, 'put', post, user2.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
	await deleteUser(user2.id);
})

test('Delete a post', async () => {
	const user = await createUser();
	const postsLength = parseInt((await postsService.getPosts()).length);
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const response = await request(`posts/${post.id}`, 'delete', {}, user.token);
	expect(response.status).toBe(204);
	const deletedPost = await postsService.getPosts();
	expect(deletedPost).toHaveLength(postsLength);
	await deleteUser(user.id);
})

test('Delete a post: Not found', async () => {
	const user = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await postsService.deletePost(post.id, user.id);
	const response = await request(`posts/${post.id}`, 'delete', {}, user.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
})

test('Delete a post: Not found (Belongs to another user)', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const post = await postsService.savePost({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const response = await request(`posts/${post.id}`, 'delete', {}, user2.token);
	expect(response.status).toBe(404);
	await postsService.deletePost(post.id, user.id);
	await deleteUser(user.id);
	await deleteUser(user2.id);
})