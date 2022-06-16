const PostsService = require('../service/PostsService');
const postsService = new PostsService();

module.exports = class PostsRoute {

	router;
	constructor(express) {
		this.router = express.Router();
		this.setRoutes();
	}

	setRoutes() {
		this.router.get('/posts', async (req, res) => {
			try {
				const posts = await postsService.getPosts();
				res.status(200).json(posts);
			} catch (e) {
				next(e);
			}
		});

		// get by id
		this.router.get('/posts/:id', async (req, res) => {

		});

		// insert
		this.router.post('/posts', async (req, res, next) => {
			const post = req.body;
			try {
				const newPost = await postsService.savePost(post);
				res.status(201).json(newPost);
			} catch (e) {
				next(e);
			}
		});

		// update
		this.router.put('/posts/:id', async (req, res, next) => {
			const post = req.body;
			try {
				await postsService.updatePost(req.params.id, post);
				res.status(204).end();
			} catch (e) {
				next(e);
			}
		});

		// delete
		this.router.delete('/posts/:id', async (req, res) => {
			try {
				await postsService.deletePost(req.params.id);
				res.status(204).end();
			} catch (e) {
				next(e);
			}
		});
	}

	getRoutes() {
		return this.router;
	}

}