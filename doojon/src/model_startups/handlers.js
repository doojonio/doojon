import { Spanner } from '@google-cloud/spanner';
import { Container } from '../breadboard.js';

/**
 * @this {import('../model.js').Model}
 */
export default async function startup() {
  /**
   * @type {Container}
   */
  const h = this._container.addContainer('h');

  const projectId = process.env.GCP_PROJECT;
  if (!projectId) {
    throw new Error('env GCP_PROJECT is not specified');
  }
  const spannerInstance = process.env.SPANNER_INSTANCE;
  if (!spannerInstance) {
    throw new Error('env SPANNER_INSTANCE is not specified');
  }

  const spannerDatabase = process.env.SPANNER_DATABASE;
  if (!spannerInstance) {
    throw new Error('env SPANNER_DATABASE is not specified');
  }

  const dbContainer = h.addContainer('db');
  const dbSchema = JSON.parse(
    await this._appHome.child('src', 'model', 'schema.json').readFile()
  );
  dbContainer.addService('schema', {
    block: () => dbSchema,
  });

  const spanner = new Spanner({ projectId });
  dbContainer.addService('spanner', { block: () => spanner });

  const instance = spanner.instance(spannerInstance);
  dbContainer.addService('instance', { block: () => instance });

  const poolOptions = this._conf.spanner?.poolOptions;
  const database = instance.database(spannerDatabase, poolOptions);
  h.addService('db', { block: () => database });

  const log = this._log;
  h.addService('log', { block: () => log });
}
