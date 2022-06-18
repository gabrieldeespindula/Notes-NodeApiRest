const environment = require('../environment/environment');
const pgp = require('pg-promise')();

const database = pgp({
	user: environment.db.user,
	password: environment.db.password,
	host: environment.db.hostuser,
	port: environment.db.portuser,
	database: environment.db.databaseuser
});

module.exports = class Data {

	database;
	schema;
	table;
	constructor(table) {
		this.schema = environment.db.schema;
		this.database = database;
		this.table = table;
	}

	delete(id) {
		return this.database.none(`delete from ${this.schema}.${this.table} where id =  $1 `, [id]);
	}

	getById(id) {
		return this.database.oneOrNone(`select * from ${this.schema}.${this.table} where id = $1`, [id]);
	}

	getAll() {
		return this.database.query(`select * from ${this.schema}.${this.table}`);
	};

}