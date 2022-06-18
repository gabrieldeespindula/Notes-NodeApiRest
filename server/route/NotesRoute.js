const Route = require('./Route');
const NotesService = require('../service/NotesService');

/** Note routes */
module.exports = class NotesRoute extends Route {

	constructor() {
		super();
		this.setRoutes();
	}

	/** Use this function to set the routes */
	setRoutes() {
		const notesService = new NotesService();

		this.router.get('/notes', super.secure_user, async (req, res, errorHandler) => {
			try {
				const notes = await notesService.getNotes(req.body.user_id);
				res.status(200).json(notes);
			} catch (e) {
				errorHandler(e);
			}
		});

		// get by id
		this.router.get('/notes/:id', async (req, res) => {

		});

		// insert
		this.router.post('/notes', super.secure_user, async (req, res, errorHandler) => {
			const note = req.body;
			try {
				const newNote = await notesService.saveNote(note);
				res.status(201).json(newNote);
			} catch (e) {
				errorHandler(e);
			}
		});

		// update
		this.router.put('/notes/:id', super.secure_user, async (req, res, errorHandler) => {
			const note = req.body;
			try {
				await notesService.updateNote(req.params.id, note);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});

		// delete
		this.router.delete('/notes/:id', super.secure_user, async (req, res, errorHandler) => {
			try {
				await notesService.deleteNote(req.params.id, req.body.user_id);
				res.status(204).end();
			} catch (e) {
				errorHandler(e);
			}
		});
	}

	/** return routes */
	getRoutes() {
		return this.router;
	}

}