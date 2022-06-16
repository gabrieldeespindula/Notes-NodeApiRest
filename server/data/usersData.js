const database = require('../environment/database');

exports.getUsers = () => {
	return database.query('select * from blog.user');
};

exports.saveUser = (user) => {
	return database.one('insert into blog.user (name, email, password) values ($1, $2, $3) returning *', [user.name, user.email, user.password]);
}

exports.deleteUser = (id) => {
	return database.none('delete from blog.user where id =  $1', [id]);
}

exports.getUser = (id) => {
	return database.oneOrNone('select * from blog.user where id = $1', [id]);
}

exports.updateUser = (id, user) => {
	return database.none('update blog.user set name = $1, password = $2 where id = $3', [user.name, user.password, id]);
}

exports.getUserByEmail = (email) => {
	return database.oneOrNone('select * from blog.user where email = $1', [email]);
}