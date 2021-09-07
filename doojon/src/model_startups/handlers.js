import { Schema } from '../model/schema.js';
import { Spanner } from '@google-cloud/spanner';

export default async function startup() {
  const h = this._container.addContainer('h');

  const isEmulator = !!process.env.SPANNER_EMULATOR_HOST;

  const projectId = process.env.DOOJON_PROJECT_ID;
  if (!isEmulator && !projectId) {
    throw new Error('env DOOJON_PROJECT_ID is not specified');
  }

  const dbBlock = () => {
    const spanner = new Spanner(isEmulator ? undefined : {projectId});
    return spanner
  };
  h.addService('db', { block: dbBlock, isSingletone: true });

  const log = this._log;
  h.addService('log', { block: () => log, isSingletone: true });

  const dbcont = h.addContainer('db');
  dbcont.addService('schema', { block: () => Schema, isSingletone: true });
}
