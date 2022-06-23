require('dotenv').config();

const environment = {
	url: 'http://localhost:3000/',
	db: {
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 5432,
		schema: 'notes',
		database: process.env.DB_DATABASE
	},
	JWT_KEY: process.env.JWT_KEY
};

module.exports = environment;