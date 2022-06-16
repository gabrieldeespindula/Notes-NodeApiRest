const database = require('../environment/database');
const Data = require('./Data');
module.exports = class extends Data {

	constructor() {
		super('user');
	}

	saveUser(user) {
		return database.one('insert into blog.user (name, email, password) values ($1, $2, $3) returning *', [user.name, user.email, user.password]);
	}

	updateUser(id, user) {
		return database.none('update blog.user set name = $1, password = $2 where id = $3', [user.name, user.password, id]);
	}

	getUserByEmail(email) {
		return database.oneOrNone('select * from blog.user where email = $1', [email]);
	}

}