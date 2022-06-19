const Data = require('./Data');

module.exports = class NotesData extends Data {

	constructor() {
		super('note');
	}

	getItemsByUserId(user_id) {
		return this.database.query(`select * from ${this.schema}.${this.table} where user_id = $1`, [user_id]);
	}

	saveNote(post) {
		return super.save(post, ['title', 'content', 'user_id'])
	}

	updateNote(id, post) {
		return this.database.none(`update ${this.schema}.${this.table} set title = $1, content = $2 where id = $3`, [post.title, post.content, id]);
	}

	getNoteByTitleAndUser(title, user_id) {
		return this.database.oneOrNone(`select * from ${this.schema}.${this.table} where title = $1 and user_id = $2`, [title, user_id]);
	}
}