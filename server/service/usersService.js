const usersData = require('../data/usersData');
const UsersData = new usersData();
const Util = require('../libs/Util');

exports.getUsers = () => {
	return UsersData.getAll();
}

exports.saveUser = async (user) => {
	Util.verifyFields(['name', 'email', 'password'], user);
	const existingUser = await UsersData.getUserByEmail(user.email);
	if (existingUser) throw new Error('User already exists');
	user.password = await Util.hashPassword(user.password);
	return UsersData.saveUser(user);
}

exports.deleteUser = (id) => {
	return UsersData.delete(id);
}

exports.getUser = async (id) => {
	const user = await UsersData.getById(id);
	if (!user) throw new Error('User not found');
	return user;
}

exports.updateUser = async (id, user) => {
	Util.verifyFields(['name', 'password'], user);
	await exports.getUser(id);
	user.password = await Util.hashPassword(user.password);
	return UsersData.updateUser(id, user);
}