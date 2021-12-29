import t from 'tap';
import { startup } from '../../../src/lib.js';
import { ValidationError } from '../../../src/model/errors.js';
import { compareSync } from 'bcrypt';

t.beforeEach(async t => {
  const app = await startup();
  t.context.app = app;
  t.context.profilesDs = app.model.getDataservice('profiles');
});

t.afterEach(async t => {
  t.context.app.model.closeAllConnections();
});

t.test('When everything is ok', async t => {
  const profilesDataservice = t.context.profilesDs;

  const originalPassword = 'password';
  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'testone',
      password: originalPassword,
    },
  ];

  let isInsertCalled = false;
  let inseredObjectId;
  profilesDataservice._db.table = tableName =>
    new Object({
      insert: ([obj]) => {
        isInsertCalled = true;

        t.equal(tableName, 'Profiles');
        t.notSame(obj.password, originalPassword);
        t.ok(
          compareSync(originalPassword, obj.password),
          'Passwords successfully compared'
        );
        t.ok(obj.id, 'Has assigned id');
        t.equal(obj.id.length, 36, 'Id length equal 36');

        inseredObjectId = obj.id;
      },
      read: () => {
        return [[]];
      },
    });

  let returnedObjectsKeys;
  await t.resolves(
    profilesDataservice
      .create(profiles)
      .then(keys => (returnedObjectsKeys = keys)),
    'Create profile resolves'
  );

  t.ok(isInsertCalled, 'Insert was called');
  t.type(returnedObjectsKeys, Array);
  t.ok(returnedObjectsKeys.length === 1, 'Returns one new key');
  t.equal(
    returnedObjectsKeys[0].id,
    inseredObjectId,
    'Returned profile id equal inserted'
  );

  t.end();
});

t.test('With short password', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'testone',
      password: 'passwor',
    },
  ];

  await t.rejects(
    profilesDataservice.create(profiles),
    new ValidationError('data/0/password must NOT have fewer than 8 characters')
  );

  t.end();
});

t.test('When objects array is null', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profiles = null;

  await t.rejects(
    profilesDataservice.create(profiles),
    new ValidationError('data must be array')
  );

  t.end();
});

t.test('Without username', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profiles = [
    {
      email: 'testone@doojon.com',
      password: 'passwor',
    },
  ];

  await t.rejects(
    profilesDataservice.create(profiles),
    new ValidationError("data/0 must have required property 'username'")
  );

  t.end();
});

t.test('Forbidden username', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profiles = [
    {
      email: 'testone@doojon.com',
      username: 'api',
      password: 'password',
    },
  ];

  await t.rejects(
    profilesDataservice.create(profiles),
    new ValidationError("Username 'api' is forbidden")
  );

  t.end();
});
