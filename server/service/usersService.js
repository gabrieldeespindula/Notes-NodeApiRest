const UsersData = require('../data/usersData');
const Util = require('../libs/Util');
const usersData = new UsersData();

const Service = require('./Service');
module.exports = class UsersService extends Service {

	constructor() {
		super();
	}

	getUsers() {
		return usersData.getAll();
	}

	async saveUser(user) {
		Util.verifyFields(['name', 'email', 'password'], user);
		const existingUser = await usersData.getUserByEmail(user.email);
		if (existingUser) throw new Error('User already exists');
		user.password = await Util.hashPassword(user.password);
		return usersData.saveUser(user);
	}

	deleteUser(id) {
		return usersData.delete(id);
	}

	async getUser(id) {
		const user = await usersData.getById(id);
		if (!user) throw new Error('User not found');
		return user;
	}

	async updateUser(id, user) {
		Util.verifyFields(['name', 'password'], user);
		await this.getUser(id);
		user.password = await Util.hashPassword(user.password);
		return usersData.updateUser(id, user);
	}

}