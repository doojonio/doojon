-- Your SQL goes here
create extension if not exists "uuid-ossp";
create table accounts (
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    password text not null,
    email text not null
);
