import t from 'tap';
import { startup } from '../../../src/lib.js';
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

  const keys = [[profileId]];

  let isDeleteCalled = false;
  profilesDataservice._db.table = tableName =>
    new Object({
      deleteRows: keysParam => {
        isDeleteCalled = true;
        t.equal(tableName, 'Profiles');
        t.same(keysParam, keys);
      },
    });

  await t.resolves(profilesDataservice.delete(keys));

  t.ok(isDeleteCalled, 'Delete was called');

  t.end();
});

t.test('Keys are undefined', async t => {
  const profilesDataservice = t.context.profilesDs;

  const keys = undefined;

  await t.rejects(
    profilesDataservice.delete(keys),
    new ValidationError('data must be array')
  );

  t.end();
});
