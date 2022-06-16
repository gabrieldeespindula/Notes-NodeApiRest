const express = require('express');
const { default: next } = require('next');
const router = express.Router();
const usersService = require('../service/usersService');

// get all
router.get('/users', async (req, res) => {
	try {
		const users = await usersService.getUsers();
		res.status(200).json(users);
	} catch (e) {
		next(e);
	}
});

// get by id
router.get('/users/:id', async (req, res) => {

});

// insert
router.post('/users', async (req, res, next) => {
	const post = req.body;
	try {
		const newUser = await usersService.saveUser(post);
		res.status(201).json(newUser);
	} catch (e) {
		next(e);
	}
});

// update
router.put('/users/:id', async (req, res, next) => {
	const post = req.body;
	try {
		await usersService.updateUser(req.params.id, post);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

// delete
router.delete('/users/:id', async (req, res) => {
	try {
		await usersService.deleteUser(req.params.id);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

module.exports = router;