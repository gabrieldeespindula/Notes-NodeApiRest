const express = require('express');
const Util = require('../libs/Util');

module.exports = class Route {

	router;
	user;
	constructor() {
		this.router = express.Router();
		this.setRoutes();
	}

	secure_user(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const user = Util.jwtVerify(token);
			req.body.user_id = user.id;
			next();
		} catch (e) {
			throw new Error('Authentication failed');
		}
	}

}