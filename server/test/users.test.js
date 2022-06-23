const axios = require('axios');
const UsersService = require('../service/UsersService');
const environment = require('../environment/environment');
const { faker } = require('@faker-js/faker');
const Util = require('../libs/Util');

const usersService = new UsersService();

const request = (endpoint, method = 'get', data, token = null) => {
	const url = environment.url + endpoint;
	const headers = token != null ? { Authorization: `Bearer ${token}` } : {};
	return axios({ url, method, data, validateStatus: false, headers });
}

test.only('Insert user', async () => {
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
	const response = await request('users', 'post', data);
	console.log(response);
	expect(response.status).toBe(201);
	const user = response.data;
	expect(user.name).toBe(data.name);
	expect(user.email).toBe(data.email);
	await usersService.deleteUser(user.id);
})

test('Insert user: Missing parameter: name', async () => {
	const data = { email: faker.internet.email(), password: faker.internet.password() };
	const response = await request('users', 'post', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: name');
})

test('Insert user: Missing parameters: [name, email, password]', async () => {
	const data = {};
	const response = await request('users', 'post', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameters: [ name, email, password ]');
})

test('Insert user: User already exists', async () => {
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
	const response1 = await request('users', 'post', data);
	const response2 = await request('users', 'post', data);
	expect(response2.status).toBe(409);
	const user = response1.data;
	await usersService.deleteUser(user.id);
})

test('Update a user', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	user.name = faker.name.findName();
	user.password = faker.internet.password();
	const response = await request(`users`, 'put', user, user.token);
	expect(response.status).toBe(204);
	const updatedUser = await usersService.getUser(user.id);
	expect(updatedUser.name).toBe(user.name);
	await usersService.deleteUser(user.id);
})

test('Update a user: Missing parameter: password', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	const data = { name: faker.name.findName() };
	const response = await request(`users`, 'put', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: password');
	await usersService.deleteUser(user.id);
})

test('Update a user: Not found', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	await usersService.deleteUser(user.id);
	const response = await request(`users`, 'put', user, user.token);
	expect(response.status).toBe(404);
})

test('Delete a user', async () => {
	const usersLength = parseInt((await usersService.getUsers()).length);
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	const response = await request(`users`, 'delete', {}, user.token);
	expect(response.status).toBe(204);
	const deletedUser = await usersService.getUsers();
	expect(deletedUser).toHaveLength(usersLength);
})

test('Delete a user: not found', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	user.token = Util.jwtSign({ id: user.id, email: user.email });
	await usersService.deleteUser(user.id);
	const response = await request(`users`, 'delete', {}, user.token);
	expect(response.status).toBe(404);
})

test('Login', async () => {
	const password = faker.internet.password();
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: password };
	const user = await usersService.saveUser(data);
	data.password = password;
	const response = await request('users/login', 'post', data);
	expect(response.status).toBe(200);
	await usersService.deleteUser(user.id);
})

test('Login: Authentication failed(email)', async () => {
	const password = faker.internet.password();
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: password };
	const user = await usersService.saveUser(data);
	data.password = password;
	data.email = faker.internet.email();
	const response = await request('users/login', 'post', data);
	expect(response.status).toBe(401);
	await usersService.deleteUser(user.id);
})

test('Login: Authentication failed(password)', async () => {
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
	const user = await usersService.saveUser(data);
	data.password = faker.internet.password();
	const response = await request('users/login', 'post', data);
	expect(response.status).toBe(401);
	await usersService.deleteUser(user.id);
})

test('Login: Missing parameter', async () => {
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
	const user = await usersService.saveUser(data);
	const response = await request('users/login', 'post', {});
	expect(response.status).toBe(400);
	await usersService.deleteUser(user.id);
})