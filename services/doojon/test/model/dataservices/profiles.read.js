import t from 'tap';
import { startup } from '../../../src/lib.js';
import { ValidationError } from '../../../src/model/errors.js';
import { IdStatus, State } from '../../../src/model/state.js';

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

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const keys = [['Angular, Google Cloud and Mojolicious teams, thank you']];
  const columns = ['username'];

  let isReadCalled = false;
  profilesDataservice._db.table = tableName =>
    new Object({
      read: req => {
        isReadCalled = true;
        t.equal(tableName, 'Profiles');
        t.match(req.keys, keys);
        t.match(req.columns, columns);

        return [[]];
      },
    });

  await t.resolves(profilesDataservice.read(state, keys, columns));

  t.ok(isReadCalled, 'Read was called');

  t.end();
});

t.test('When empty array of keys', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const keys = [];
  const columns = undefined;

  await t.rejects(
    profilesDataservice.read(state, keys, columns),
    new ValidationError('keys - data must NOT have fewer than 1 items')
  );

  t.end();
});

t.test('When empty columns', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const keys = [['someId']];
  const columns = [];

  await t.rejects(
    profilesDataservice.read(state, keys, columns),
    new ValidationError('columns - data must NOT have fewer than 1 items')
  );

  t.end();
});

t.test('Reading secret fields', async t => {
  const profilesDataservice = t.context.profilesDs;

  const identity = {
    status: IdStatus.UNAUTHORIZED,
  };
  const state = new State(identity);

  const keys = [['someId']];
  const columns = ['email', 'password'];

  await t.rejects(
    profilesDataservice.read(state, keys, columns),
    new ValidationError(
      'columns - data/0 must be equal to one of the allowed values'
    )
  );

  t.end();
});
