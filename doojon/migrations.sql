-- 1 up
create table users (
    id int primary key generated always as identity,
    username varchar(32) unique not null,
    email varchar(500) unique not null,
    password text not null
);
-- 1 down
drop table users;