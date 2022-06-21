require('dotenv').config();

const environment = {
	url: 'http://localhost:3000/',
	db: {
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: 5432,
		schema: 'notes',
		database: process.env.DB_DATABASE
	},
	JWT_KEY: process.env.JWT_KEY
};

// Host
// ec2-54-147-33-38.compute-1.amazonaws.com
// Database
// d99uoeq7bif2md
// User
// yqlttwvlwtxawg
// Port
// 5432
// Password
// 4e6fd64a9ce58a3e41f436abac565f589d5f761d0956b62245951f4c98b7b488

module.exports = environment;