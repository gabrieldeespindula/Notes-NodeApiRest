create schema notes;

create table notes.note (
	id serial primary key,
	title text not null,
	content text not null,
	user_id integer not null,
	date timestamp default now()
	foreign key (user_id) references notes.user (id)
);

create table notes.user (
	id serial primary key,
	name text not null,
	email text not null UNIQUE,
	password text not null,
	date timestamp default now()
);