const database = require('../environment/database');

module.exports = class Data {

	database;
	table;
	constructor(table) {
		this.table = 'blog.' + table;
		this.database = database;
	}

	delete(id) {
		return database.none(`delete from ${this.table} where id =  $1 `, [id]);
	}

	getById(id) {
		return database.oneOrNone(`select * from ${this.table} where id = $1`, [id]);
	}

	getAll() {
		return database.query(`select * from ${this.table}`);
	};

}