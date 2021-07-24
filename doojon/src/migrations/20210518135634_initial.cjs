exports.up = function (db) {
  return db.schema
    .raw('create extension if not exists "uuid-ossp";')
    .raw('create extension if not exists "pgcrypto";')
    .raw('create extension if not exists "hstore";')
    .raw(shortIdTriggerFunction)
    .createTable('profiles', table => {
      table.uuid('id').primary();
      table.text('username').unique().notNullable();
      table.timestamp('create_time').notNullable().defaultTo(db.fn.now());
    })
    .createTable('challenges', table => {
      table.text('id').primary();
      table.text('title').notNullable();
      table.text('description');
      table.text('personal_tag');
      table.text('public_tag').unique();
      table.bool('is_public').notNullable().defaultTo('false');
      table.bool('is_hidden').notNullable().defaultTo('false');
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_challenges_genid BEFORE INSERT ON challenges FOR EACH ROW EXECUTE PROCEDURE unique_short_id();`
    )
    .createTable('profile_favorite_challenges', table => {
      table.uuid('profile').notNullable().references('profiles.id');
      table.text('challenge').notNullable().references('challenges.id');
      table.primary(['profile', 'challenge']);
    })
    .createTable('challenge_comments', table => {
      table.text('id').primary();
      table.text('challenge').notNullable().references('challenges.id');
      table.text('parent').references('challenge_comments.id');
      table.text('text').notNullable();
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_challenge_comments_genid BEFORE INSERT ON challenge_comments
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('challenge_proposals', table => {
      table.text('id').primary();
      table.text('challenge').references('challenges.id');
    })
    .raw(
      `CREATE TRIGGER trigger_challenge_proposals_genid BEFORE INSERT ON challenge_proposals
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id();`
    )
    .createTable('challenge_proposal_comments', table => {
      table.text('id').primary();
      table.text('proposal').references('challenge_proposals.id').notNullable();
      table.text('text').notNullable();
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
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_posts_genid BEFORE INSERT ON posts
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .createTable('post_comments', table => {
      table.text('id').primary();
      table.text('post').notNullable().references('posts.id');
      table.text('parent_comment').references('post_comments.id');
      table.text('text').notNullable();
      table.timestamp('update_time');
    })
    .raw(
      `CREATE TRIGGER trigger_post_comments_genid BEFORE INSERT ON post_comments
      FOR EACH ROW EXECUTE PROCEDURE unique_short_id()`
    )
    .raw(
      `CREATE TYPE event AS ENUM(
        'following_started',
        'challenge_created',
        'challenge_commented',
        'challenge_proposed',
        'challenge_proposal_commented',
        'post_created',
        'post_liked',
        'post_commented',
        'post_comment_liked'
      )`
    )
    .createTable('events', table => {
      table
        .uuid('id')
        .notNullable()
        .primary()
        .defaultTo(db.raw('uuid_generate_v4()'));
      table.uuid('emitter').notNullable().references('profiles.id');
      table.specificType('type', 'event').notNullable();
      table.text('object').notNullable();
      table.timestamp('when').notNullable().defaultTo(db.fn.now());
      table.unique(['emitter', 'type', 'object']);
    })
    .raw(eventObjectCheckerFunction).raw(`
      CREATE TRIGGER trigger_events_object_checker BEFORE INSERT OR UPDATE ON events
      FOR EACH ROW EXECUTE PROCEDURE check_event_object()
    `);
};

exports.down = function (db) {
  return db.schema
    .raw(
      `
      DROP TRIGGER IF EXISTS trigger_events_object_checker ON events;
      DROP TRIGGER IF EXISTS trigger_post_comments_genid ON post_comments;
      DROP TRIGGER IF EXISTS trigger_posts_genid ON posts;
      DROP TRIGGER IF EXISTS trigger_challenge_proposal_comments_genid ON challenge_proposal_comments;
      DROP TRIGGER IF EXISTS trigger_challenge_proposals_genid ON challenge_proposals;
      DROP TRIGGER IF EXISTS trigger_challenges_genid ON challenges;
    `
    )
    .dropTableIfExists('events')
    .raw(`DROP TYPE IF EXISTS event`)
    .dropTableIfExists('post_comments')
    .dropTableIfExists('posts')
    .dropTableIfExists('challenge_proposal_comments')
    .dropTableIfExists('challenge_proposals')
    .dropTableIfExists('challenge_comments')
    .dropTableIfExists('profile_favorite_challenges')
    .dropTableIfExists('challenges')
    .dropTableIfExists('profiles');
};

const eventObjectCheckerFunction = `
CREATE OR REPLACE FUNCTION check_event_object() RETURNS trigger as $EOF$
  DECLARE
    types2table hstore := hstore(ARRAY[
      'following_started', 'profiles',
      'challenge_created', 'challenges',
      'challenge_commented', 'challenge_comments',
      'challenge_proposed', 'challenge_proposals',
      'challenge_proposal_commented', 'challenge_proposal_comments',
      'post_created', 'posts',
      'post_liked', 'posts',
      'post_commented', 'post_comments',
      'post_comment_liked', 'post_comments'
    ]);
    objtable text := types2table -> NEW.type::text;
    objexists boolean;
  BEGIN
      EXECUTE format('SELECT EXISTS(SELECT FROM %I WHERE id::text = %L)', objtable, NEW.object)
      INTO objexists;
      IF objexists != true THEN
        RAISE EXCEPTION 'invalid % event: object % does not exists', NEW.type, NEW.object;
      END IF;
      RETURN NEW;
  END;
$EOF$ LANGUAGE plpgsql;
`;

const shortIdTriggerFunction = `
CREATE OR REPLACE FUNCTION unique_short_id()
RETURNS TRIGGER AS $$

DECLARE
  key TEXT;
  qry TEXT;
  found TEXT;
BEGIN
  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';

  LOOP
    key := substring(encode(gen_random_bytes(8), 'base64') for 11);
    key := replace(key, '/', 's'); -- url safe replacement
    key := replace(key, '+', 'p'); -- url safe replacement
    key := replace(key, '=', 'e'); -- url safe replacement

    EXECUTE qry || quote_literal(key) INTO found;

    IF found IS NULL THEN
      EXIT;
    END IF;

  END LOOP;

  NEW.id = key;
  RETURN NEW;
END;
$$ language 'plpgsql';
`;
