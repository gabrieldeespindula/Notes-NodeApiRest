const Service = require('./Service');
const NotesData = require('../data/NotesData');
const Util = require('../libs/Util');

module.exports = class NotesService extends Service {
	notesData;

	constructor() {
		super();
		this.noteData = new NotesData();
	}

	getNotes(user_id) {
		return this.noteData.getItemsByUserId(user_id);
	}

	async saveNote(note) {
		Util.verifyFields(['title', 'content', 'user_id'], note);
		const existingNote = await this.noteData.getNoteByTitleAndUser(note.title, note.user_id);
		if (existingNote) throw new Error('Note already exists');
		return this.noteData.saveNote(note);
	}

	async deleteNote(id, user_id) {
		const noteDb = await this.getNote(id);
		if (user_id != noteDb.user_id) throw new Error('Note not found');
		return this.noteData.delete(id);
	}

	async getNote(id) {
		const note = await this.noteData.getById(id);
		if ((!note || note.user_id != noteDb.user_id) throw new Error('Note not found');
		return note;
	}

	async updateNote(id, note) {
		Util.verifyFields(['title', 'content'], note);
		const noteDb = await this.getNote(id);
		if (note.user_id != noteDb.user_id) throw new Error('Note not found');
		return this.noteData.updateNote(id, note);
	}
}