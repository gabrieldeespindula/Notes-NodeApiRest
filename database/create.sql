create schema blog;

create table blog.post (
	id serial primary key,
	title text not null,
	content text not null,
	date timestamp default now()
);

create table blog.user (
	id serial primary key,
	name text not null,
	email text not null UNIQUE,
	password text not null,
	date timestamp default now()
);