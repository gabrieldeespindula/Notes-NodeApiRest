const express = require('express');
const Util = require('../libs/Util');
const UserService = require('../service/UsersService')

module.exports = class Route {

	router;
	user;
	constructor() {
		this.router = express.Router();
		this.setRoutes();
	}

	async secure_user(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const user = Util.jwtVerify(token);
			req.body.user_id = user.id;
			next();
		} catch (e) {
			return res.status(401).send('Authentication failed');
		}
	}

}