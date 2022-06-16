const usersData = require('../data/usersData');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, function (err, hash) {
			if (err) reject(err)
			resolve(hash)
		});
	})

	return hashedPassword;
}

const verifyFields = (fields, object) => {
	let arrayMissing = [];
	fields.forEach(field => {
		if (!object[field]) {
			arrayMissing.push(field);
		}
	})
	if (arrayMissing.length == 0) return;
	if (arrayMissing.length == 1) throw new Error(`Missing parameter: ${arrayMissing[0]}`);
	if (arrayMissing.length > 1) {
		let message = "";
		arrayMissing.forEach((item) => {
			message += item + ", ";
		})
		message = message.slice(0, -2);
		throw new Error(`Missing parameters: [ ${message} ]`);
	}
}

exports.getUsers = () => {
	return usersData.getUsers();
}

exports.saveUser = async (user) => {
	verifyFields(['name', 'email', 'password'], user);
	const existingUser = await usersData.getUserByEmail(user.email);
	if (existingUser) throw new Error('User already exists');
	user.password = await hashPassword(user.password);
	return usersData.saveUser(user);
}

exports.deleteUser = (id) => {
	return usersData.deleteUser(id);
}

exports.getUser = async (id) => {
	const user = await usersData.getUser(id);
	if (!user) throw new Error('User not found');
	return user;
}

exports.updateUser = async (id, user) => {
	verifyFields(['name', 'password'], user);
	await exports.getUser(id);
	user.password = await hashPassword(user.password);
	return usersData.updateUser(id, user);
}