const Data = require('./Data');
module.exports = class UsersData extends Data {

	constructor() {
		super('user');
	}

	saveUser(user) {
		return this.database.one(`insert into ${this.schema}.${this.table} (name, email, password) values ($1, $2, $3) returning *`, [user.name, user.email, user.password]);
	}

	updateUser(id, user) {
		return this.database.none(`update ${this.schema}.${this.table} set name = $1, password = $2 where id = $3`, [user.name, user.password, id]);
	}

	getUserByEmail(email) {
		return this.database.oneOrNone(`select * from ${this.schema}.${this.table} where email = $1`, [email]);
	}

}