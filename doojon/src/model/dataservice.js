import { Service } from './service.js';
import { State, ID_STATUS_SYSTEM } from './state.js';
import { ForbiddenError } from './errors.js';
import { DataserviceGuard } from './ds_guard.js';
import { Database } from '@google-cloud/spanner';
import { Logger } from '@mojojs/core';

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
   * Guard should be redefined in child dataservices using _customdeps.
   * Otherwise there will be alway forbidden errors unless user status is not `SYSTEM`
   *
   * @type {DataserviceGuard}
   *
   */
  _guard = undefined;

  static get deps() {
    return Object.assign(
      {
        _log: '/h/log',
        _db: '/h/db',
        _dbschema: '/h/db/schema',
      },
      this._customdeps
    );
  }
  /**
   * Custom dependencies are specified in subclasses
   *
   * @private
   */
  static get _customdeps() {
    return {};
  }

  /**
   * @private
   */
  static get _tablename() {
    throw new Error('_tablename is undefined');
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
      throw Error('objects (second argument) is not array of objects');
    }

    if (state.uinfo.status !== ID_STATUS_SYSTEM) {
      const guard = this._guard;
      if (!guard) {
        throw new ForbiddenError('create action has been forbidden');
      }
      await guard.precreateCheck(state, objects);
      await guard.precreateAction(state, objects);
    }

    this._log.trace(`Inserting objects in ${this.constructor._tablename}`);

    const ids = await this._db(this.constructor._tablename)
      .insert(objects)
      .returning(this._primarykeys);

    await this._postCreate(state, ids);

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
    if (state.uinfo.status !== ID_STATUS_SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('read action has been forbidden');
      }
      await this._guard.prereadCheck(state, where);
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
    if (state.uinfo.status !== ID_STATUS_SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('update action has been forbidden');
      }
      await this._guard.preupdateCheck(state, where, newFields);
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
    if (state.uinfo.status !== ID_STATUS_SYSTEM) {
      if (!this._guard) {
        throw new ForbiddenError('delete action has been forbidden');
      }
      await this._guard.predeleteCheck(state, where);
    }

    this._log.trace(`deleting objects from ${this.constructor._tablename}`);

    return await this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }
}
