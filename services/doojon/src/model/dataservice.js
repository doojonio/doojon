import { DataserviceGuard } from './ds_guard.js';
import { Database } from '@google-cloud/spanner';
import { Logger } from '@mojojs/core';
import { DataserviceSteward } from './ds_steward.js';

export class Dataservice {
  /**
   * Insert objects on dataservice's primary table
   *
   * @param {Array<Object>} objects
   * @returns {Promise<Array<Object>>} array of {id: string}
   */
  async create(objects) {
    await this._guard.preCreateCheck(objects);

    this._log.trace(`Inserting objects in ${this.constructor._tableName}`);

    await this._steward.manageMutationsForNewObjects(objects);
    await this._steward.manageTimestampsForNewObjects(objects);

    let shouldRetry = true;
    let tryNum = 0;
    let previousError;
    let insertedObjectsKeys;

    while (shouldRetry) {
      shouldRetry = false;
      tryNum += 1;

      if (tryNum > 1) {
        this._log.warn(
          'Retrying to insert objects ' +
            `on ${this.constructor._tableName}. ` +
            `Try: ${tryNum}. ` +
            `Cause: ${previousError}`
        );
      }

      insertedObjectsKeys = await this._steward.manageKeysForNewObjects(
        objects
      );
      try {
        await this._db.table(this.constructor._tableName).insert(objects);
      } catch (error) {
        shouldRetry = await this._steward.handleInsertError(error, tryNum);
        previousError = error;
      }
    }

    return insertedObjectsKeys;
  }

  /**
   * Read objects from dataservice's primary table
   *
   * @param {Object} columns
   * @returns TODO
   */
  async read(keys, columns) {
    await this._guard.preReadCheck(keys, columns);

    this._log.trace(`Reading objects from ${this.constructor._tableName}`);

    const table = this._db.table(this.constructor._tableName);
    const readRequest = {
      columns,
      keys,
    };

    const [rows] = await table.read(readRequest);
    const objects = [];
    for (const row of rows) {
      objects.push(row.toJSON());
    }

    return objects;
  }

  /**
   * Update objects in dataservice's primary table
   *
   * @param {Object} where
   * @param {Object} newFields
   * @returns TODO
   */
  async update(rows) {
    await this._guard.preUpdateCheck(rows);

    this._log.trace(`Updating objects in ${this.constructor._tableName}`);

    await this._steward.manageMutationsForUpdatedRows(rows);
    await this._db.table(this.constructor._tableName).update(rows);
  }

  /**
   * Delete objects from dataservice's primary table
   *
   * @param {Object} where
   * @returns TODO
   */
  async delete(keys) {
    await this._guard.preDeleteCheck(keys);

    this._log.trace(`Deleting objects from ${this.constructor._tableName}`);

    await this._db.table(this.constructor._tableName).deleteRows(keys);
  }

  constructor() {
    /**
     * @type {Database}
     */
    this._db;
    /**
     * @type {Logger}
     */
    this._log;
    /**
     * @type {Object}
     */
    this._schema;
    /**
     * @type {DataserviceGuard}
     */
    this._guard;
    /**
     * @type {DataserviceSteward}
     */
    this._steward;
  }

  static get deps() {
    const moniker = this._moniker;
    const tableName = this._tableName;

    return Object.assign(
      {
        _log: '/h/log',
        _db: '/h/db',
        _schema: `/h/db/schema/${tableName}`,
        _guard: `/ds_guards/${moniker}`,
        _steward: `/ds_stewards/${moniker}`,
      },
      this._customDeps
    );
  }
  /**
   * Custom dependencies are specified in subclasses
   *
   * @private
   */
  static get _customDeps() {
    return {};
  }

  /**
   * @private
   */
  static get _tableName() {
    throw new Error('_tablename is undefined');
  }

  static get _moniker() {
    throw new Error('_moniker is undefined');
  }
}
