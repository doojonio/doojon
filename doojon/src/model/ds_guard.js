import { Database } from '@google-cloud/spanner';
import { NotAuthorizedError, ValidationError } from './errors.js';
import { Service } from './service.js';
import { IdStatus, State } from './state.js';

export class DataserviceGuard extends Service {
  static get _objectsCreateSchema() {}
  static get _columnsReadSchema() {}
  static get _keysSchema() {}
  static get _rowsUpdateSchema() {}

  _guardReadNeededFields = [];

  constructor(...args) {
    super(...args);

    /**
     * @type {Database}
     */
    this._db;
    /**
     * @type {import('ajv').default}
     */
    this._validator;

    this._validateKeys = this._validator.compile(this.constructor._keysSchema);
    this._validateCreateWhat = this._validator.compile(
      this.constructor._objectsCreateSchema
    );
    this._validateReadColumns = this._validator.compile(
      this.constructor._columnsReadSchema
    );
    this._validateUpdateRows = this._validator.compile(
      this.constructor._rowsUpdateSchema
    );
  }

  static get deps() {
    return Object.assign(
      {
        _db: '/h/db',
        _validator: '/s/validator',
        _config: '/conf',
      },
      this._customdeps
    );
  }
  static get _customdeps() {
    return {};
  }

  /**
   * Dataservices call this method of their guard to
   * ensure that create action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  async preCreateCheck(state, objects) {
    if (!this._validateCreateWhat(objects)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateCreateWhat.errors)
      );
    }

    return this._preCreateAdditionalChecks(state, objects);
  }

  async _preCreateAdditionalChecks(state, objects) {}

  /**
   * Dataservices call this method of their guard to
   * ensure that read action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Object} where
   */
  async preReadCheck(state, keys, columns) {
    if (!this._validateKeys(keys)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateKeys.errors)
      );
    }
    if (!this._validateReadColumns(columns)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateReadColumns.errors)
      );
    }
  }

  /**
   * Dataservices call this method of their guard to
   * ensure that update action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Object} where
   * @param {Object} fields - new values
   */
  async preUpdateCheck(state, where, what) {
    if (!this._validateUpdateWhat(what)) {
      throw new ValidationError(this._validator.errorsText);
    }
    if (!this._validateUpdateWhere(where)) {
      throw new ValidationError(this._validator.errorsText);
    }
  }

  /**
   * Dataservices call this method of their guard to
   * ensure that delete action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Object} where
   */
  async preDeleteCheck(state, where) {
    if (!this._validateDeleteWhere(where)) {
      throw new ValidationError(this._validator.errorsText);
    }
  }

  /**
   * @throws NotAuthorizedError unless user in state is authorized
   *
   * @param {State} state
   */
  isAuthorized(state) {
    if (state.identity.status !== IdStatus.AUTHORIZED) {
      throw new NotAuthorizedError();
    }
  }
}
