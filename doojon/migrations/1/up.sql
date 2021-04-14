create extension if not exists "uuid-ossp";

create or replace function generate_random_string(length integer) returns text as
$$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
begin
  if length < 0 then
    raise exception 'Given length cannot be less than 0';
  end if;
  for i in 1..length loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$ language plpgsql;

create or replace function generate_challenge_id() returns text as
$$
declare
  length integer := 11;
  new_id text := '';
begin
  new_id = generate_random_string(length);
  loop
    exit when not exists(select id from challenges where id = new_id);
    new_id = generate_random_string(length);
  end loop;
  return new_id;
end;
$$ language plpgsql;

create or replace function generate_post_id() returns text as
$$
declare
  length integer := 11;
  new_id text := '';
begin
  new_id = generate_random_string(length);
  loop
    exit when not exists(select id from posts where id = new_id);
    new_id = generate_random_string(length);
  end loop;
  return new_id;
end;
$$ language plpgsql;

create or replace function generate_post_comment_id() returns text as
$$
declare
  length integer := 11;
  new_id text := '';
begin
  new_id = generate_random_string(length);
  loop
    exit when not exists(select id from post_comments where id = new_id);
    new_id = generate_random_string(length);
  end loop;
  return new_id;
end;
$$ language plpgsql;

-- -- -- -- -- --

create table profiles(
  id uuid primary key, -- accounts service identifier
  username text unique,
  reg_date date unique default now()
);
create table challenges(
  id text primary key default generate_challenge_id(),
  title text not null,
  descr text,
  proposed_by uuid not null references profiles(id),
  create_time timestamp with time zone not null default now(),
  update_time timestamp with time zone not null default now()
);
create table posts(
  id text primary key default generate_post_id(),
  challenge_id text not null references challenges(id),
  title text not null,
  body text not null,
  writed_by uuid not null references profiles(id),
  create_time timestamp with time zone not null default now()
);
create table post_likes(
  post_id text not null references posts(id),
  liked_by uuid not null references profiles(id),
  primary key (post_id, liked_by)
);
create table post_comments (
  id text primary key default generate_post_comment_id(),
  post_id text not null references posts(id),
  message text not null,
  writed_by uuid not null references profiles(id),
  create_time timestamp with time zone not null default now()
);
create table post_comment_likes(
  comment_id text not null references posts(id),
  liked_by uuid not null references profiles(id),
  primary key (comment_id, liked_by)
);
