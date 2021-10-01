import { Service } from './service.js';
import { State, IdStatus } from './state.js';
import { ForbiddenError, ValidationError } from './errors.js';
import { DataserviceGuard } from './ds_guard.js';
import { Database, Snapshot, Transaction } from '@google-cloud/spanner';
import { Logger } from '@mojojs/core';
import { DataserviceSteward } from './ds_steward.js';

export class Dataservice extends Service {
  /**
   * @type {Database}
   */
  _db;
  /**
   * @type {Logger}
   */
  _log;
  /**
   * @type {Object}
   */
  _dbschema;
  /**
   * @type {DataserviceGuard}
   *
   */
  _guard;

  /**
   * @type {DataserviceSteward}
   */
  _steward;

  static get deps() {
    const moniker = this._moniker;
    const tableName = this._tableName;

    return Object.assign(
      {
        _log: '/h/log',
        _db: '/h/db',
        _schema: `/h/db/schema/${tableName}`,
        _guard: `/ds_guards/${moniker}`,
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

  /**
   * Object with column names (as keys) and their's defenitions (as values)
   *
   * @private
   * @type {Object}
   */
  get fields() {
    return this._dbschema.tables[this.constructor._tablename];
  }

  /**
   * Array of primary keys for dataservice's primary table
   * @private
   * @type {Array<string>}
   */
  get _primarykeys() {
    const fields = this.fields;
    const pkeys = [];

    for (const colname of Object.keys(fields)) {
      if (this.fields[colname]['is_primary_key']) pkeys.push(colname);
    }

    return pkeys;
  }

  /**
   * Insert objects on dataservice's primary table
   *
   * @param {State} state
   * @param {Array<Object>} objects
   * @returns {Array<Object>} array of {id: string}
   */
  async create(state, objects) {
    if (!Array.isArray(objects)) {
      throw new ValidationError(
        'objects (second argument) is not array of objects'
      );
    }

    await this._guard.preCreateCheck(state, objects);

    this._log.trace(`Inserting objects in ${this.constructor._tableName}`);

    let shouldRetry = true;
    let tryNum = 0;

    while (shouldRetry) {
      shouldRetry = false;
      tryNum += 1;

      if (tryNum > 1) {
        this._log.warn(
          'Retrying to insert objects ' +
            `on ${this.constructor._tableName}. ` +
            `Try: ${tryNum}`
        );
      }

      await this._steward.manageKeysForNewObjects(state, objects);
      try {
        await this._db.table(this.constructor._tableName).insert(objects);
      } catch (error) {
        shouldRetry = await this._steward.handleInsertError(error, tryNum);
      }
    }

    return ids;
  }

  /**
   * Read objects from dataservice's primary table
   *
   * @param {Stae} state
   * @param {Object} where
   * @returns TODO
   */
  async read(state, where) {
    if (state.uinfo.status !== IdStatus.SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('read action has been forbidden');
      }
      await this._guard.preReadCheck(state, where);
    }

    this._log.trace(`Reading objects from ${this.constructor._tablename}`);
    return await this._db
      .select()
      .from(this.constructor._tablename)
      .where(where);
  }

  /**
   * Update objects in dataservice's primary table
   *
   * @param {State} state
   * @param {Object} where
   * @param {Object} newFields
   * @returns TODO
   */
  async update(state, where, newFields) {
    if (state.uinfo.status !== IdStatus.SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('update action has been forbidden');
      }
      await this._guard.preUpdateCheck(state, where, newFields);
    }

    this._log.trace(`updating objects in ${this.constructor._tablename}`);
    return await this._db(this.constructor._tablename)
      .where(where)
      .update(newFields)
      .returning(this._primarykeys);
  }

  /**
   * Delete objects from dataservice's primary table
   *
   * @param {State} state
   * @param {Object} where
   * @returns TODO
   */
  async delete(state, where) {
    if (state.uinfo.status !== IdStatus.SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('delete action has been forbidden');
      }
      await this._guard.preDeleteCheck(state, where);
    }

    this._log.trace(`deleting objects from ${this.constructor._tablename}`);

    return await this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }
}
