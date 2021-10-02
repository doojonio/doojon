import t from 'tap';
import { startup } from '../src/lib.js';
import { Model } from '../src/model.js';

import { Dataservice } from '../src/model/dataservice.js';
import { DataserviceGuard } from '../src/model/ds_guard.js';
import { DataserviceSteward } from '../src/model/ds_steward.js';

t.beforeEach(async t => {
  t.context.app = await startup();
});
t.afterEach(async t => {
  t.context.app.model._container.resolve('/h/db/').close();
});

t.test('Model', async t => {
  const model = t.context.app.model;

  t.type(model, Model, 'Model is instance of Model class');

  t.end();
});

t.test('Dataservices', async t => {
  const app = t.context.app;
  const model = app.model;

  const dsDir = app.home.child('src', 'model', 'dataservices');

  for await (const jsFile of dsDir.list()) {
    const name = jsFile.basename('.js');

    const jsClass = (await import(jsFile.toString())).default;

    const dataservice = model.getDataservice(name);
    t.type(
      dataservice, Dataservice,
      'Is instance of Dataservice class'
    );
    t.type(dataservice, jsClass, "Is instance of it's own class");

    const shouldCan = ['create', 'read', 'update', 'delete'];

    for (const method of shouldCan) {
      t.type(dataservice[method], Function, `It has method ${method}`);
    }
  }

  t.end();
});

t.test('DataserviceGuards', async t => {
  const app = t.context.app;
  const model = app.model;

  const guardsDir = app.home.child('src', 'model', 'ds_guards');

  for await (const jsFile of guardsDir.list()) {
    const name = jsFile.basename('.js');
    const jsClass = (await import(jsFile.toString())).default;

    const guard = model.getDsGuard(name);

    t.type(guard, DataserviceGuard, 'Is instance of DataserviceGuard');
    t.type(guard, jsClass, 'Is instance of it class');

    const shouldCan = [
      'preCreateCheck',
      'preReadCheck',
      'preUpdateCheck',
      'preDeleteCheck',
    ];

    for (const method of shouldCan) {
      t.type(guard[method], Function, `Has method ${method}`);
    }
  }

  t.end();
});

t.test('DataserviceStewards', async t => {
  const app = t.context.app;
  const model = app.model;

  const stewardsDir = app.home.child('src', 'model', 'ds_stewards');

  for await (const jsFile of stewardsDir.list()) {
    const name = jsFile.basename('.js');
    const jsClass = (await import(jsFile.toString())).default;

    const steward = model._container.resolve(`/ds_stewards/${name}`);

    t.type(
      steward, DataserviceSteward,
      'Is instance of DataserviceSteward'
    );
    t.type(steward, jsClass, 'Is instance of it class');

    const shouldCan = [
      'handleInsertError',
      'manageKeysForNewObjects',
      '_generateRandomKeys',
      '_generateRandomUUID',
    ];

    for (const method of shouldCan) {
      t.type(steward[method], Function, `Has method ${method}`);
    }
  }

  t.end();
});
