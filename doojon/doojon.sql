-- 1 up
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
  generated_challenge_id text := '';
begin
  generated_challenge_id = generate_random_string(length);
  loop
    exit when not exists(select id from challenges where id = generated_challenge_id);
    generated_challenge_id = generate_random_string(length);
  end loop;
  return generated_challenge_id;
end;
$$ language plpgsql;


create table profiles(
  id uuid primary key,
  username text unique
);
create table challenges(
  id text primary key default generate_challenge_id()
);
-- 1 down
drop table profiles;
drop table challenges;
drop function generate_random_string(integer);
drop function generate_challenge_id();
