import { Spanner } from '@google-cloud/spanner';
import { createClient as createRedisClient } from 'redis';
import { Container } from '../breadboard.js';

/**
 * @this {import('../model.js').Model}
 */
export default async function startup() {
  /**
   * @type {Container}
   */
  const h = this._container.addContainer('h');
  const dbContainer = h.addContainer('db');

  await setupRedis.call(this, { h });
  await setupSpanner.call(this, { dbContainer, h });
  await setupSchema.call(this, { dbContainer });
  await setupLog.call(this, {h});
}

async function setupLog({h}) {
  const log = this._log;
  h.addService('log', { block: () => log });
}

async function setupSpanner({ dbContainer, h }) {
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

  const spanner = new Spanner({ projectId });
  dbContainer.addService('spanner', { block: () => spanner });

  const instance = spanner.instance(spannerInstance);
  dbContainer.addService('instance', { block: () => instance });

  const poolOptions = this._conf.spanner?.poolOptions;
  const database = instance.database(spannerDatabase, poolOptions);
  h.addService('db', { block: () => database });
}

async function setupRedis({ dbContainer, h }) {
  const redisOptions = this._conf.handlers.redis;
  const redisClient = createRedisClient(redisOptions);
  redisClient.connect();

  h.addService('redis', {
    block: () => redisClient,
  });
}

async function setupSchema({ dbContainer }) {
  const dbSchema = JSON.parse(
    await this._appHome.child('src', 'model', 'schema.json').readFile()
  );
  dbContainer.addService('schema', {
    block: () => dbSchema,
  });

  const schemaContainer = dbContainer.addContainer('schema');

  for (const [tableName, tableSchema] of Object.entries(dbSchema)) {
    schemaContainer.addService(tableName, { block: () => tableSchema });
  }
}
