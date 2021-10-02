import t from 'tap';
import { startup } from '../../../src/lib.js';
import { ForbiddenError, ValidationError } from '../../../src/model/errors.js';
import { IdStatus, State } from '../../../src/model/state.js';
import { compareSync } from 'bcrypt';

t.beforeEach(async t => {
  const app = await startup();
  t.context.profilesDs = await app.model.getDataservice('profiles');
});

t.afterEach(async t => {
  await t.context.profilesDs._db.close();
});

t.test('When everything is ok', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const originalPassword = 'password';
  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'testone',
      password: originalPassword,
    },
  ];

  let isInsertCalled = false;

  profilesDataservice._db.table = (tableName) =>
    new Object({
      insert: ([obj]) => {
        isInsertCalled = true;

        t.equal(tableName, 'Profiles');
        t.notSame(obj.password, originalPassword);
        t.ok(
          compareSync(originalPassword, obj.password),
          'Passwords successfully compared'
        );
      },
    });

  await t.resolves(
    profilesDataservice.create(state, profiles),
    'Create profile resolves'
  );

  t.ok(isInsertCalled, 'Insert was called');

  t.end();
});

t.test('When already authorized', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.AUTHORIZED,
  };
  const state = new State(identity);

  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'testone',
      password: 'password',
    },
  ];

  await t.rejects(
    profilesDataservice.create(state, profiles),
    new ForbiddenError('User has to be unauthorized to create profiles')
  );

  t.end();
});

t.test('With short password', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'testone',
      password: 'passwor',
    },
  ];

  await t.rejects(
    profilesDataservice.create(state, profiles),
    new ValidationError('data/0/password must NOT have fewer than 8 characters')
  );

  t.end();
});

t.test('When objects array is null', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const profiles = null;

  await t.rejects(
    profilesDataservice.create(state, profiles),
    new ValidationError('objects (second argument) is not array of objects')
  );

  t.end();
});

t.test('Without username', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const profiles = [
    {
      email: 'testone@doojon.com',
      password: 'passwor',
    },
  ];

  await t.rejects(
    profilesDataservice.create(state, profiles),
    new ValidationError("data/0 must have required property 'username'")
  );

  t.end();
});

t.test('Forbidden username', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'api',
      password: 'password',
    },
  ];

  await t.rejects(
    profilesDataservice.create(state, profiles),
    new ValidationError("Username 'api' is forbidden")
  );

  t.end();
});
