const postsData = require('../data/postsData');

exports.getPosts = () => {
	return postsData.getPosts();
}

exports.savePost = (post) => {
	return postsData.savePost(post);
}

exports.deletePost = (id) => {
	return postsData.deletePost(id);
}

exports.getPost = (id) => {
	return postsData.getPost(id);
}

exports.updatePost = (id, post) => {
	return postsData.updatePost(id, post);
}