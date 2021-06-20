-- Your SQL goes here

create table sessions (
    id uuid primary key default uuid_generate_v4(),
    account_id uuid not null references accounts(id),
    create_time timestamptz not null default now()
);