require('dotenv').config();

const environment = {
	URL: process.env.ENV_URL,
	DATABASE_URL: process.env.DATABASE_URL,
	DATABASE_URL_ADDITIONAL_CONFIG: process.env.DATABASE_URL_ADDITIONAL_CONFIG || '',
	JWT_KEY: process.env.JWT_KEY
};

module.exports = environment;