const Data = require('./Data');

module.exports = class PostsData extends Data {

	constructor() {
		super('note');
	}

	savePost(post) {
		return this.database.one(`insert into ${this.schema}.${this.table} (title, content) values ($1, $2) returning *`, [post.title, post.content]);
	}

	updatePost(id, post) {
		return this.database.none(`update ${this.schema}.${this.table} set title = $1, content = $2 where id = $3`, [post.title, post.content, id]);
	}

	getPostByTitle(title) {
		return this.database.oneOrNone(`select * from ${this.schema}.${this.table} where title = $1`, [title]);
	}
}