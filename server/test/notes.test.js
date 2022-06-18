const axios = require('axios');
const NotesService = require('../service/NotesService');
const UsersService = require('../service/UsersService');
const environment = require('../environment/environment');
const { faker } = require('@faker-js/faker');
const Util = require('../libs/Util');

const notesService = new NotesService();
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

test('Get notes', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const notesLength = parseInt((await notesService.getNotes(user.id)).length);
	const arrayNotes = [];
	for (let i = 1; i <= 3; i++) {
		const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id };
		const insertId = await notesService.saveNote(data);
		arrayNotes.push(insertId);
	}
	for (let i = 1; i <= 3; i++) {
		const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user2.id };
		const insertId = await notesService.saveNote(data);
		arrayNotes.push(insertId);
	}
	const response = await request('notes', 'get', {}, user.token);
	expect(response.status).toBe(200);
	const notes = response.data;
	expect(notes).toHaveLength(notesLength + 3);
	arrayNotes.forEach(async (item) => {
		await notesService.deleteNote(item.id, item.user_id);
	});
	await deleteUser(user.id);
	await deleteUser(user2.id);
})

test('Insert note', async () => {
	const user = await createUser();
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text() };
	const response = await request('notes', 'post', data, user.token);
	expect(response.status).toBe(201);
	const note = response.data;
	expect(note.title).toBe(data.title);
	expect(note.content).toBe(data.content);
	await notesService.deleteNote(note.id, user.id);
	await deleteUser(user.id);
})

test('Insert note: Missing parameter: title', async () => {
	const user = await createUser();
	const data = { content: faker.lorem.text(), user_id: user.id };
	const response = await request('notes', 'post', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: title');
	await deleteUser(user.id);
})

test('Insert note: Missing parameters: [title, content]', async () => {
	const user = await createUser();
	const data = {};
	const response = await request('notes', 'post', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameters: [ title, content ]');
	await deleteUser(user.id);
})

test('Insert note: Note already exists', async () => {
	const user = await createUser();
	const data = { title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id };
	const response1 = await request('notes', 'post', data, user.token);
	const response2 = await request('notes', 'post', data, user.token);
	expect(response2.status).toBe(409);
	const note = response1.data;
	await notesService.deleteNote(note.id, user.id);
	await deleteUser(user.id);
})

test('Update a note', async () => {
	const user = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	note.title = faker.lorem.sentence();
	note.content = faker.lorem.text();
	const response = await request(`notes/${note.id}`, 'put', note, user.token);
	expect(response.status).toBe(204);
	const updatedNote = await notesService.getNote(note.id);
	expect(updatedNote.title).toBe(note.title);
	expect(updatedNote.content).toBe(note.content);
	await notesService.deleteNote(note.id, user.id);
	await deleteUser(user.id);
})

test('Update a note: Missing parameter: content', async () => {
	const user = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const data = { title: faker.lorem.sentence() };
	const response = await request(`notes/${note.id}`, 'put', data, user.token);
	expect(response.status).toBe(400);
	expect(response.data).toBe('Missing parameter: content');
	await notesService.deleteNote(note.id, user.id);
	await deleteUser(user.id);
})

test('Update a note: Not found', async () => {
	const user = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await notesService.deleteNote(note.id, user.id);
	const response = await request(`notes/${note.id}`, 'put', note, user.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
})

test('Update a note: Not found (Belongs to another user)', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await notesService.deleteNote(note.id, user.id);
	const response = await request(`notes/${note.id}`, 'put', note, user2.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
	await deleteUser(user2.id);
})

test('Delete a note', async () => {
	const user = await createUser();
	const notesLength = parseInt((await notesService.getNotes()).length);
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const response = await request(`notes/${note.id}`, 'delete', {}, user.token);
	expect(response.status).toBe(204);
	const deletedNote = await notesService.getNotes();
	expect(deletedNote).toHaveLength(notesLength);
	await deleteUser(user.id);
})

test('Delete a note: Not found', async () => {
	const user = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	await notesService.deleteNote(note.id, user.id);
	const response = await request(`notes/${note.id}`, 'delete', {}, user.token);
	expect(response.status).toBe(404);
	await deleteUser(user.id);
})

test('Delete a note: Not found (Belongs to another user)', async () => {
	const user = await createUser();
	const user2 = await createUser();
	const note = await notesService.saveNote({ title: faker.lorem.sentence(), content: faker.lorem.text(), user_id: user.id });
	const response = await request(`notes/${note.id}`, 'delete', {}, user2.token);
	expect(response.status).toBe(404);
	await notesService.deleteNote(note.id, user.id);
	await deleteUser(user.id);
	await deleteUser(user2.id);
})