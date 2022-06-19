const Data = require('./Data');
module.exports = class UsersData extends Data {

	constructor() {
		super('user');
	}

	saveUser(user) {
		return super.save(user, ['name', 'email', 'password']);
	}

	updateUser(id, user) {
		return super.update(id, user, ['name', 'password']);
	}

	getUserByEmail(email) {
		return this.database.oneOrNone(`select * from ${this.schema}.${this.table} where email = $1`, [email]);
	}

}