const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const environment = require('../environment/environment')
module.exports = class Util {

	constructor() {
	}

	static verifyFields(fields, object) {
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

	static async hashPassword(password) {
		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, function (err, hash) {
				if (err) reject(err)
				resolve(hash)
			});
		})

		return hashedPassword;
	}

	static async comparePassword(password1, password2) {
		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.compare(password1, password2, function (err, hash) {
				if (err) reject(err)
				resolve(hash)
			});
		})

		return hashedPassword;
	}

	static jwtSign(data) {
		return jwt.sign(data, environment.JWT_KEY, { expiresIn: "7d" })
	}

	static jwtVerify(data) {
		return jwt.verify(data, environment.JWT_KEY)
	}

}