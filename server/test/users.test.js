const axios = require('axios');
const UsersService = require('../service/UsersService');
const environment = require('../environment/environment');
const { faker } = require('@faker-js/faker');

const usersService = new UsersService();

const request = (endpoint, method = 'get', data) => {
	const url = environment.url + endpoint;
	return axios({ url, method, data, validateStatus: false });
}

test('Get users', async () => {
	const usersBeforeTest = await usersService.getUsers();
	const usersLength = usersBeforeTest ? usersBeforeTest.length : 0;
	const arrayUsers = [];
	for (let i = 1; i <= 3; i++) {
		let data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
		let insertId = await usersService.saveUser(data);
		arrayUsers.push(insertId);
	}
	const response = await request('users');
	expect(response.status).toBe(200);
	const users = response.data;
	expect(users).toHaveLength(usersLength + 3);
	arrayUsers.forEach(async (item) => {
		await usersService.deleteUser(item.id);
	});
})

test('Insert user', async () => {
	const data = { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() };
	const response = await request('users', 'post', data);
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
	user.name = faker.name.findName();
	user.password = faker.internet.password();
	const response = await request(`users/${user.id}`, 'put', user);
	expect(response.status).toBe(204);
	const updatedUser = await usersService.getUser(user.id);
	expect(updatedUser.name).toBe(user.name);
	await usersService.deleteUser(user.id);
})

test('Update a user: Missing parameter: password', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	const data = { name: faker.name.findName() };
	const response = await request(`users/${user.id}`, 'put', data);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: password');
	await usersService.deleteUser(user.id);
})

test('Update a user: Not found', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	await usersService.deleteUser(user.id);
	const response = await request(`users/${user.id}`, 'put', user);
	expect(response.status).toBe(404);
})

test('Delete a user', async () => {
	const usersLength = parseInt((await usersService.getUsers()).length);
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	const response = await request(`users/${user.id}`, 'delete');
	expect(response.status).toBe(204);
	const deletedUser = await usersService.getUsers();
	expect(deletedUser).toHaveLength(usersLength);
})

test('Delete a user: Not found', async () => {
	const user = await usersService.saveUser({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() });
	await usersService.deleteUser(user.id);
	const response = await request(`users/${user.id}`, 'put', user);
	expect(response.status).toBe(404);
})