exports.up = function (knex) {
  return knex.schema
    .raw('create extension if not exists "uuid-ossp";')
    .raw(generatingFunctionsSQL)
    .createTable('profiles', table => {
      table.uuid('id').primary();
      table.text('username').unique();
      table.date('reg_date').unique();
    })
    .createTable('challenges', table => {
      table.text('id').primary().defaultTo('generate_challenge_id()');
      table.text('title').notNullable();
      table.text('descr');
      table.uuid('proposed_by').notNullable().references('profiles.id');
      table
        .timestamp('create_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
      table
        .timestamp('update_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
    })
    .createTable('posts', table => {
      table.text('id').primary().defaultTo('generate_post_id()');
      table.text('challenge_id').notNullable().references('challenges.id');
      table.text('title').notNullable();
      table.text('body').notNullable();
      table.uuid('writted_by').notNullable().references('profiles.id');
      table
        .timestamp('create_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
      table
        .timestamp('update_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
    })
    .createTable('post_likes', table => {
      table.text('post_id').notNullable().references('posts.id');
      table.uuid('liked_by').notNullable().references('profiles.id');
      table.primary(['post_id', 'liked_by']);
    })
    .createTable('post_comments', table => {
      table.text('id').primary().defaultTo('generate_post_comment_id()');
      table.text('post_id').notNullable().references('posts.id');
      table.text('message').notNullable();
      table.uuid('writed_by').notNullable().references('profiles.id');
      table
        .timestamp('create_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
      table
        .timestamp('update_time', { useTz: true })
        .notNullable()
        .defaultTo('now()');
    })
    .createTable('post_comment_likes', table => {
      table.text('comment_id').notNullable().references('post_comments.id');
      table.uuid('liked_by').notNullable().references('profiles.id');
      table.primary(['comment_id', 'liked_by']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('post_comment_likes')
    .dropTableIfExists('post_comments')
    .dropTableIfExists('post_likes')
    .dropTableIfExists('posts')
    .dropTableIfExists('challenges')
    .dropTableIfExists('profiles');
};

const generatingFunctionsSQL = `
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
`;
