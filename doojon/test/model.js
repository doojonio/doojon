import t from 'tap';
import { startup } from '../src/lib.js';
import { Model } from '../src/model.js';

import { Dataservice } from '../src/model/dataservice.js';
import { DataserviceGuard } from '../src/model/ds_guard.js';
import { DataserviceSteward } from '../src/model/ds_steward.js';

t.test('Model', async t => {
  const app = await startup();
  const model = app.model;

  t.ok(model instanceof Model, 'Model is instance of Model class');

  t.end();
});

t.test('Dataservices', async t => {
  const app = await startup();
  const model = app.model;

  const dsDir = app.home.child('src', 'model', 'dataservices');

  for await (const jsFile of dsDir.list()) {
    const name = jsFile.basename('.js');

    const jsClass = (await import(jsFile.toString())).default;

    const dataservice = model.getDataservice(name);
    t.ok(
      dataservice instanceof Dataservice,
      'Is instance of Dataservice class'
    );
    t.ok(dataservice instanceof jsClass, "Is instance of it's own class");

    const shouldCan = ['create', 'read', 'update', 'delete'];

    for (const method of shouldCan) {
      t.ok(dataservice[method] instanceof Function, `It has method ${method}`);
    }
  }

  t.end();
});

t.test('DataserviceGuards', async t => {
  const app = await startup();
  const model = app.model;

  const guardsDir = app.home.child('src', 'model', 'ds_guards');

  for await (const jsFile of guardsDir.list()) {
    const name = jsFile.basename('.js');
    const jsClass = (await import(jsFile.toString())).default;

    const guard = model.getDsGuard(name);

    t.ok(guard instanceof DataserviceGuard, 'Is instance of DataserviceGuard');
    t.ok(guard instanceof jsClass, 'Is instance of it class');

    const shouldCan = [
      'preCreateCheck',
      'preReadCheck',
      'preUpdateCheck',
      'preDeleteCheck',
    ];

    for (const method of shouldCan) {
      t.ok(guard[method] instanceof Function, `Has method ${method}`);
    }
  }

  t.end();
});

t.test('DataserviceStewards', async t => {
  const app = await startup();
  const model = app.model;

  const stewardsDir = app.home.child('src', 'model', 'ds_stewards');

  for await (const jsFile of stewardsDir.list()) {
    const name = jsFile.basename('.js');
    const jsClass = (await import(jsFile.toString())).default;

    const steward = model._container.resolve(`/ds_stewards/${name}`);

    t.ok(
      steward instanceof DataserviceSteward,
      'Is instance of DataserviceSteward'
    );
    t.ok(steward instanceof jsClass, 'Is instance of it class');

    const shouldCan = [
      'handleInsertError',
      'manageKeysForNewObjects',
      '_generateRandomKeys',
      '_generateRandomUUID',
    ];

    for (const method of shouldCan) {
      t.ok(steward[method] instanceof Function, `Has method ${method}`);
    }
  }

  t.end();
});
