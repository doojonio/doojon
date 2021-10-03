import { Database, Spanner } from '@google-cloud/spanner';
import { Service } from './service.js';
import { randomBytes, randomUUID } from 'crypto';

/**
 * General class for dataservice stewards.
 * Stewards modify incoming data and run post-actions
 */
export class DataserviceSteward extends Service {
  constructor(...args) {
    super(...args);

    /**
     * @type {Database}
     */
    this._db;
    /**
     * @type {Object}
     */
    this._schema;
  }

  static get _tableName() {
    throw new Error('Table name is undefined');
  }

  static get deps() {
    const tableName = this._tableName;
    return Object.assign(
      {
        _db: '/h/db',
        _schema: `/h/db/schema/${tableName}`,
        _crypt: '/s/crypt',
      },
      this._customDeps
    );
  }

  static get _customDeps() {
    return {};
  }

  async manageMutationsForNewObjects(_state, _objects) {}

  async manageKeysForNewObjects(_state, objects) {
    for (const object of objects) {
      const keys = this._generateRandomKeys();

      for (const [key, value] of Object.entries(keys)) {
        object[key] = value;
      }
    }
  }

  async manageTimestampsForNewObjects(_state, objects) {
    if (this._schema.columns.created === undefined) {
      return;
    }

    const currentTimestamp = Spanner.timestamp();
    for (const object of objects) {
      object.created = currentTimestamp;
    }
  }

  // TODO: retries
  async handleInsertError(error, _tryNum) {
    throw error;
  }

  _generateRandomKeys() {
    const schema = this._schema;

    const generatedValues = {};

    for (const key of schema.keys) {
      const columnSchema = schema.columns[key];
      generatedValues[key] = this._crypt.generateUrlSafeKey(
        columnSchema.maxLength
      );
    }

    return generatedValues;
  }
}
