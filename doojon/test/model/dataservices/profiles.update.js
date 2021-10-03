import t from 'tap';
import { startup } from '../../../src/lib.js';
import { IdStatus, State } from '../../../src/model/state.js';
import { compareSync } from 'bcrypt';
import { ValidationError } from '../../../src/model/errors.js';

t.beforeEach(async t => {
  const app = await startup();
  t.context.app = app;
  t.context.profilesDs = await app.model.getDataservice('profiles');
});

t.afterEach(async t => {
  t.context.app.model.closeAllConnections();
});

t.test('Everything is ok', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profileId = 'someId';
  const identity = {
    status: IdStatus.AUTHORIZED,
    profileId,
  };
  const state = new State(identity);

  const originalPassword = 'myNewPassword';
  const rows = [
    {
      id: profileId,
      password: originalPassword,
    },
  ];

  let isUpdateCalled = false;
  profilesDataservice._db.table = tableName =>
    new Object({
      update: rowsToUpdate => {
        isUpdateCalled = true;
        t.equal(tableName, 'Profiles');
        t.notSame(
          rowsToUpdate[0].password,
          originalPassword,
          'Updated password was mutated'
        );
        t.ok(
          compareSync(originalPassword, rowsToUpdate[0].password),
          'Passwords successfully compared'
        );
      },
    });

  await t.resolves(profilesDataservice.update(state, rows));

  t.ok(isUpdateCalled, 'Update was called');

  t.end();
});

t.test('Without id', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profileId = 'someId';
  const identity = {
    status: IdStatus.AUTHORIZED,
    profileId,
  };
  const state = new State(identity);

  const rows = [
    {
      password: 'does not matter',
      username: 'new username',
    },
  ];

  await t.rejects(
    profilesDataservice.update(state, rows),
    new ValidationError("data/0 must have required property 'id'")
  );

  t.end();
});

t.test('Only id', async t => {
  const profilesDataservice = t.context.profilesDs;

  const profileId = 'someId';
  const identity = {
    status: IdStatus.AUTHORIZED,
    profileId,
  };
  const state = new State(identity);

  const rows = [
    {
      id: profileId,
    },
  ];

  await t.rejects(
    profilesDataservice.update(state, rows),
    new ValidationError('data/0 must NOT have fewer than 2 items')
  );

  t.end();
});
