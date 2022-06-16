const postsData = require('../data/postsData');
const PostsData = new postsData();
const Util = require('../libs/Util');

exports.getPosts = () => {
	return PostsData.getAll();
}

exports.savePost = async (post) => {
	Util.verifyFields(['title', 'content'], post);
	const existingPost = await PostsData.getPostByTitle(post.title);
	if (existingPost) throw new Error('Post already exists');
	return PostsData.savePost(post);
}

exports.deletePost = (id) => {
	return PostsData.delete(id);
}

exports.getPost = async (id) => {
	const post = await PostsData.getById(id);
	if (!post) throw new Error('Post not found');
	return post;
}

exports.updatePost = async (id, post) => {
	Util.verifyFields(['title', 'content'], post);
	await exports.getPost(id);
	return PostsData.updatePost(id, post);
}