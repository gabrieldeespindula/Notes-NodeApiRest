const postsData = require('../data/postsData');

exports.getPosts = () => {
	return postsData.getPosts();
}

exports.savePost = async (post) => {
	const existingPost = await postsData.getPostByTitle(post.title);
	if (existingPost) throw new Error('Post already exists');
	return postsData.savePost(post);
}

exports.deletePost = (id) => {
	return postsData.deletePost(id);
}

exports.getPost = (id) => {
	const post = postsData.getPost(id);
	if (!post) throw new Error('Post not found');
	return post;
}

exports.updatePost = async (id, post) => {
	await exports.getPost(id);
	return postsData.updatePost(id, post);
}