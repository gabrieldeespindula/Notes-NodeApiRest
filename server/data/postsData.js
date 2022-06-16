const database = require('../environment/database');
const Data = require('./Data');

module.exports = class PostsData extends Data {

	constructor() {
		super('post');
	}

	savePost(post) {
		return database.one('insert into blog.post (title, content) values ($1, $2) returning *', [post.title, post.content]);
	}

	updatePost(id, post) {
		return database.none('update blog.post set title = $1, content = $2 where id = $3', [post.title, post.content, id]);
	}

	getPostByTitle(title) {
		return database.oneOrNone('select * from blog.post where title = $1', [title]);
	}
}