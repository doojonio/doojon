exports.up = function (knex) {
  return knex.schema
    .raw('create extension if not exists "uuid-ossp";')
    .raw('create extension if not exists "pgcrypto";')
    .raw(shortIdTrigger)
    .createTable('profiles', table => {
      table.uuid('id').primary();
      table.text('username').unique().notNullable();
      table.timestamp('create_time').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('challenges', table => {
      table.text('id').primary();
      table.text('title').notNullable();
      table.text('description');
      table.text('personal_tag');
      table.text('public_tag').unique();
      table.uuid('proposed_by').notNullable().references('profiles.id');
      table.bool('is_public').notNullable().defaultTo('false');
      table.bool('is_hidden').notNullable().defaultTo('false');
      table
        .timestamp('create_time')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_challenges_genid BEFORE INSERT ON challenges FOR EACH ROW EXECUTE PROCEDURE unique_short_id();`
    )
    .createTable('profile_favorite_challenges', table => {
      table.uuid('profile_id').notNullable().references('profiles.id');
      table.text('challenge_id').notNullable().references('challenges.id');
      table.primary(['profile_id', 'challenge_id']);
    })
    .createTable('challenge_comments', table => {
      table.text('id').primary();
      table.text('challenge_id').notNullable().references('challenges.id');
      table.text('parent_id').references('challenge_comments.id');
      table.text('text').notNullable();
      table.timestamp('create_time').notNullable().defaultTo(knex.fn.now());
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_challenge_comments_genid BEFORE INSERT ON challenge_comments
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('challenge_proposals', table => {
      table.text('id').primary();
      table.text('challenge_id').references('challenges.id');
      table.timestamp('create_time').notNullable().defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER trigger_challenge_proposals_genid BEFORE INSERT ON challenge_proposals
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id();`
    )
    .createTable('challenge_proposal_comments', table => {
      table.text('id').primary();
      table
        .text('proposal_id')
        .references('challenge_proposals.id')
        .notNullable();
      table.text('text').notNullable();
      table.uuid('written_by').references('profiles.id').notNullable();
      table
        .timestamp('create_time')
        .defaultTo(knex.fn.now())
        .notNullable();
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_challenge_proposal_comments_genid BEFORE INSERT ON challenge_proposal_comments
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('posts', table => {
      table.text('id').primary();
      table.text('title');
      table.specificType('tags', 'text[]');
      table.text('text').notNullable();
      table.bool('is_hidden').notNullable().defaultTo('false');
      table.uuid('written_by').notNullable().references('profiles.id');
      table
        .timestamp('create_time')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_posts_genid BEFORE INSERT ON posts
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('post_likes', table => {
      table.text('post_id').notNullable().references('posts.id');
      table.uuid('liked_by').notNullable().references('profiles.id');
      table.primary(['post_id', 'liked_by']);
    })
    .createTable('post_comments', table => {
      table.text('id').primary();
      table.text('post_id').notNullable().references('posts.id');
      table.text('parent_comment_id').references('post_comments.id');
      table.text('text').notNullable();
      table.uuid('written_by').notNullable().references('profiles.id');
      table
        .timestamp('create_time')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_post_comments_genid BEFORE INSERT ON post_comments
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('post_comment_likes', table => {
      table.text('comment_id').notNullable().references('post_comments.id');
      table.uuid('liked_by').notNullable().references('profiles.id');
      table.primary(['comment_id', 'liked_by']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .raw(`
      DROP TRIGGER IF EXISTS trigger_post_comments_genid ON post_comments;
      DROP TRIGGER IF EXISTS trigger_posts_genid ON posts;
      DROP TRIGGER IF EXISTS trigger_challenge_proposal_comments_genid ON challenge_proposal_comments;
      DROP TRIGGER IF EXISTS trigger_challenge_proposals_genid ON challenge_proposals;
      DROP TRIGGER IF EXISTS trigger_challenges_genid ON challenges;
    `)
    .dropTableIfExists('post_comment_likes')
    .dropTableIfExists('post_comments')
    .dropTableIfExists('post_likes')
    .dropTableIfExists('posts')
    .dropTableIfExists('challenge_proposal_comments')
    .dropTableIfExists('challenge_proposals')
    .dropTableIfExists('challenge_comments')
    .dropTableIfExists('profile_favorite_challenges')
    .dropTableIfExists('challenges')
    .dropTableIfExists('profiles');
};

const shortIdTrigger = `
-- Create a trigger function that takes no arguments.
-- Trigger functions automatically have OLD, NEW records
-- and TG_TABLE_NAME as well as others.
CREATE OR REPLACE FUNCTION unique_short_id()
RETURNS TRIGGER AS $$

 -- Declare the variables we'll be using.
DECLARE
  key TEXT;
  qry TEXT;
  found TEXT;
BEGIN

  -- generate the first part of a query as a string with safely
  -- escaped table name, using || to concat the parts
  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';

  -- This loop will probably only run once per call until we've generated
  -- millions of ids.
  LOOP

    -- Generate our string bytes and re-encode as a base64 string.
    key := encode(gen_random_bytes(6), 'base64');

    -- Base64 encoding contains 2 URL unsafe characters by default.
    -- The URL-safe version has these replacements.
    key := replace(key, '/', 's'); -- url safe replacement
    key := replace(key, '+', 'p'); -- url safe replacement
    key := replace(key, '=', 'e'); -- url safe replacement

    -- Concat the generated key (safely quoted) with the generated query
    -- and run it.
    -- SELECT id FROM "test" WHERE id='blahblah' INTO found
    -- Now "found" will be the duplicated id or NULL.
    EXECUTE qry || quote_literal(key) INTO found;

    -- Check to see if found is NULL.
    -- If we checked to see if found = NULL it would always be FALSE
    -- because (NULL = NULL) is always FALSE.
    IF found IS NULL THEN

      -- If we didn't find a collision then leave the LOOP.
      EXIT;
    END IF;

    -- We haven't EXITed yet, so return to the top of the LOOP
    -- and try again.
  END LOOP;

  -- NEW and OLD are available in TRIGGER PROCEDURES.
  -- NEW is the mutated row that will actually be INSERTed.
  -- We're replacing id, regardless of what it was before
  -- with our key variable.
  NEW.id = key;

  -- The RECORD returned here is what will actually be INSERTed,
  -- or what the next trigger will get if there is one.
  RETURN NEW;
END;
$$ language 'plpgsql';
`;
