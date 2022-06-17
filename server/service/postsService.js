const Service = require('./Service');
const PostsData = require('../data/PostsData');
const Util = require('../libs/Util');

module.exports = class PostsService extends Service {
	postsData;

	constructor() {
		super();
		this.postData = new PostsData();
	}

	getPosts() {
		return this.postData.getAll();
	}

	async savePost(post) {
		Util.verifyFields(['title', 'content'], post);
		const existingPost = await this.postData.getPostByTitle(post.title);
		if (existingPost) throw new Error('Post already exists');
		return this.postData.savePost(post);
	}

	deletePost(id) {
		return this.postData.delete(id);
	}

	async getPost(id) {
		const post = await this.postData.getById(id);
		if (!post) throw new Error('Post not found');
		return post;
	}

	async updatePost(id, post) {
		Util.verifyFields(['title', 'content'], post);
		await this.getPost(id);
		return this.postData.updatePost(id, post);
	}
}