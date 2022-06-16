const postsData = require('../data/postsData');
const PostsData = new postsData();

const verifyFields = (fields, object) => {
	let arrayMissing = [];
	fields.forEach(field => {
		if (!object[field]) {
			arrayMissing.push(field);
		}
	})
	if (arrayMissing.length == 0) return;
	if (arrayMissing.length == 1) throw new Error(`Missing parameter: ${arrayMissing[0]}`);
	if (arrayMissing.length > 1) {
		let message = "";
		arrayMissing.forEach((item) => {
			message += item + ", ";
		})
		message = message.slice(0, -2);
		throw new Error(`Missing parameters: [ ${message} ]`);
	}
}

exports.getPosts = () => {
	return PostsData.getAll();
}

exports.savePost = async (post) => {
	verifyFields(['title', 'content'], post);
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
	verifyFields(['title', 'content'], post);
	await exports.getPost(id);
	return PostsData.updatePost(id, post);
}