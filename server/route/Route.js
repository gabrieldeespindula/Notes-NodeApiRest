const express = require('express');
const Util = require('../libs/Util');

module.exports = class Route {

	router;
	constructor() {
		this.router = express.Router();
		this.setRoutes();
	}

	secure_user(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decode = Util.jwtVerify(token);
			req.user = decode;
		} catch (e) {
			throw new Error('Authentication failed');
		}
	}

}