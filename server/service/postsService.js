const PostsData = require('../data/postsData');
const postsData = new PostsData();
const Util = require('../libs/Util');

const Service = require('./Service');
module.exports = class PostsService extends Service {

	constructor() {
		super();
	}

	getPosts() {
		return postsData.getAll();
	}

	async savePost(post) {
		Util.verifyFields(['title', 'content'], post);
		const existingPost = await postsData.getPostByTitle(post.title);
		if (existingPost) throw new Error('Post already exists');
		return postsData.savePost(post);
	}

	deletePost(id) {
		return postsData.delete(id);
	}

	async getPost(id) {
		const post = await postsData.getById(id);
		if (!post) throw new Error('Post not found');
		return post;
	}

	async updatePost(id, post) {
		Util.verifyFields(['title', 'content'], post);
		await this.getPost(id);
		return postsData.updatePost(id, post);
	}
}