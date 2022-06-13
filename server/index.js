const express = require('express');
const app = express();

app.use(express.json());
app.use('/', require('./route/postsRoute'));
app.use((error, req, res, next) => {
	if (error.message === 'Post already exists') {
		return res.status(409).send(error.message);
	}
	if (error.message.indexOf('not found') > -1) {
		return res.status(404).send(error.message);
	}
	if (error.message.indexOf('Missing parameter',) > -1) {
		return res.status(400).send(error.message);
	}
	return res.status(500).send(error.message);
})

app.listen(3000);