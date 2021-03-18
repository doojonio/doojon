-- 1 up
create table profiles(
    id int primary key generated always as identity,
    username text,
    email text
);
-- 1 down
drop table profiles;
