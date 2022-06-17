const environment = require('../environment/environment');
const pgp = require('pg-promise')();

module.exports = class Data {

	database;
	table;
	constructor(table) {
		this.table = 'blog.' + table;
		this.database = this.connect();
	}

	connect() {
		return pgp({
			user: environment.db.user,
			password: environment.db.password,
			host: environment.db.hostuser,
			port: environment.db.portuser,
			database: environment.db.databaseuser
		});
	}

	delete(id) {
		return this.database.none(`delete from ${this.table} where id =  $1 `, [id]);
	}

	getById(id) {
		return this.database.oneOrNone(`select * from ${this.table} where id = $1`, [id]);
	}

	getAll() {
		return this.database.query(`select * from ${this.table}`);
	};

}