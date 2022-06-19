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

	/**
	 * @function Insert 
	 * @param {*} data Data to be entered
	 * @param {*} columns Columns for insertion
	 * @returns 
	 */
	save(data, columns) {
		const values = [];
		const parameters = [];
		columns.forEach((item, index) => {
			parameters.push(data[item])
			values.push('$' + (index + 1));
		})
		const columnsSql = columns.join(',');
		const valuesSql = values.join(',');

		return this.database.one(`insert into ${this.schema}.${this.table} (${columnsSql}) values (${valuesSql}) returning *`, parameters);
	}

}