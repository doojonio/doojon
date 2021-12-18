import { Spanner } from '@google-cloud/spanner';

/**
 * General class for dataservice stewards.
 * Stewards modify incoming data and run post-actions
 */
export class DataserviceSteward {
  constructor() {
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
        _schema: `/h/db/schema/${tableName}`,
        _crypt: '/s/crypt',
      },
      this._customDeps
    );
  }

  static get _customDeps() {
    return {};
  }

  async manageMutationsForNewObjects(_objects) {}

  async manageKeysForNewObjects(objects) {
    let newObjectsKeys = [];
    for (const object of objects) {
      const keys = this._generateRandomKeys();

      for (const [key, value] of Object.entries(keys)) {
        object[key] = value;
      }

      newObjectsKeys.push(keys);
    }

    return newObjectsKeys;
  }

  async manageTimestampsForNewObjects(objects) {
    if (this._schema.columns.created === undefined) {
      return;
    }

    const currentTimestamp = Spanner.timestamp();
    for (const object of objects) {
      object.created = currentTimestamp;
    }
  }

  async manageMutationsForUpdatedRows(objects) {}

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
