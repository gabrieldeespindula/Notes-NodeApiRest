const Service = require('./Service');
const UsersData = require('../data/UsersData');
const NotesData = require('../data/NotesData');
const Util = require('../libs/Util');

module.exports = class UsersService extends Service {
	usersData;

	constructor() {
		super();
		this.usersData = new UsersData();
	}

	getUser(user_id) {
		return this.usersData.getById(user_id);
	}

	async saveUser(user) {
		Util.verifyFields(['name', 'email', 'password'], user);
		const existingUser = await this.usersData.getUserByEmail(user.email);
		if (existingUser) throw new Error('User already exists');
		user.password = await Util.hashPassword(user.password);
		return this.usersData.saveUser(user);
	}

	async deleteUser(id) {
		const notesData = new NotesData();
		await this.getUser(id);
		await notesData.deleteByUserId(id);
		return await this.usersData.delete(id);
	}

	async getUser(id) {
		const user = await this.usersData.getById(id);
		if (!user) throw new Error('User not found');
		return user;
	}

	async updateUser(id, user) {
		Util.verifyFields(['name', 'password'], user);
		await this.getUser(id);
		user.password = await Util.hashPassword(user.password);
		return this.usersData.updateUser(id, user);
	}

	async login(login) {
		Util.verifyFields(['email', 'password'], login);
		const user = await this.usersData.getUserByEmail(login.email);
		if (!user) throw new Error('Authentication failed');
		const verifyPassword = await Util.comparePassword(login.password, user.password);
		if (!verifyPassword) throw new Error('Authentication failed');
		const dataJwt = {
			id: user.id,
			email: user.email
		}
		return Util.jwtSign(dataJwt);
	}

}