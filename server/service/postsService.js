const Service = require('./Service');
const PostsData = require('../data/PostsData');
const Util = require('../libs/Util');

module.exports = class PostsService extends Service {
	postsData;

	constructor() {
		super();
		this.postData = new PostsData();
	}

	getPosts(user_id) {
		return this.postData.getItemsByUserId(user_id);
	}

	async savePost(post) {
		Util.verifyFields(['title', 'content', 'user_id'], post);
		const existingPost = await this.postData.getPostByTitleAndUser(post.title, post.user_id);
		if (existingPost) throw new Error('Post already exists');
		return this.postData.savePost(post);
	}

	async deletePost(id, user_id) {
		const postDb = await this.getPost(id);
		if (user_id != postDb.user_id) throw new Error('Post not found');
		return this.postData.delete(id);
	}

	async getPost(id) {
		const post = await this.postData.getById(id);
		if (!post) throw new Error('Post not found');
		return post;
	}

	async updatePost(id, post) {
		Util.verifyFields(['title', 'content'], post);
		const postDb = await this.getPost(id);
		if (post.user_id != postDb.user_id) throw new Error('Post not found');
		return this.postData.updatePost(id, post);
	}
}