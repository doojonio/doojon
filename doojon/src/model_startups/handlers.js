import { Schema } from '../model/schema.js';
import { Spanner } from '@google-cloud/spanner';
import { Container } from '../breadboard.js';

export default async function startup() {
  /**
   * @type {Container}
   */
  const h = this._container.addContainer('h');

  const isEmulator = !!process.env.SPANNER_EMULATOR_HOST;

  const projectId = process.env.DOOJON_PROJECT_ID;
  if (!isEmulator && !projectId) {
    throw new Error('env DOOJON_PROJECT_ID is not specified');
  }

  const spannerInstanceName = process.env.SPANNER_INSTANCE;
  const spannerDatabaseName = process.env.SPANNER_DATABASE;

  const dbContainer = h.addContainer('db');

  const spanner = new Spanner(isEmulator ? undefined : {projectId});
  dbContainer.addService('spanner', {block: () => spanner});

  const instance = spanner.instance(spannerInstanceName);
  dbContainer.addService('instance', {block: () => instance});

  const poolOptions = this._conf.spanner?.poolOptions;
  const database = instance.database(spannerDatabaseName, poolOptions);
  h.addService('db', { block: () => database, isSingletone: true });

  const log = this._log;
  h.addService('log', { block: () => log, isSingletone: true });

  const dbcont = h.addContainer('db');
  dbcont.addService('schema', { block: () => Schema, isSingletone: true });
}
