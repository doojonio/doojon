-- Your SQL goes here
create extension if not exists "uuid-ossp";
create table accounts (
    id uuid primary key default uuid_generate_v4(),
    email text not null,
    password text not null,
    first_name text,
    last_name text,
    birthday date
);
