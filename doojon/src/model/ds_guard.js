import { Database } from '@google-cloud/spanner';
import { ForbiddenError, ValidationError } from './errors.js';
import { Service } from './service.js';
import { IdStatus, State } from './state.js';

export class DataserviceGuard extends Service {
  /**
   * @type {Database}
   */
  _db;
  /**
   * @type {import('ajv').default}
   */
  _validator;

  static get _objectsCreateSchema() {}
  static get _whereReadSchema() {}
  static get _whatReadSchema() {}
  static get _whereUpdateSchema() {}
  static get _whatUpdateSchema() {}
  static get _whereDeleteSchema() {}

  _validateCreateWhat;
  _validateReadWhere;
  _validateReadWhat;
  _validateUpdateWhere;
  _validateUpdateWhat;
  _validateDeleteWhere;

  _guardReadNeededFields = [];

  _postInit() {
    this._validateCreateWhat = this._validator.compile(
      this.constructor._objectsCreateSchema
    );
    this._validateReadWhere = this._validator.compile(
      this.constructor._whereReadSchema
    );
    this._validateReadWhat = this._validator.compile(
      this.constructor._whatReadSchema
    );
    this._validateUpdateWhere = this._validator.compile(
      this.constructor._whereUpdateSchema
    );
    this._validateUpdateWhat = this._validator.compile(
      this.constructor._whatUpdateSchema
    );
    this._validateDeleteWhere = this._validator.compile(
      this.constructor._whereDeleteSchema
    );
  }

  static get deps() {
    return Object.assign(
      {
        _db: '/h/db',
        _validator: '/s/validator',
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
      throw new ValidationError(this._validator.errorsText);
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
  async preReadCheck(state, what, where) {
    if (!this._validateReadWhat(what)) {
      throw new ValidationError(this._validator.errorsText);
    }
    if (!this._validateReadWhere(where)) {
      throw new ValidationError(this._validator.errorsText);
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
    if (state.uinfo.status !== IdStatus.AUTHORIZED) {
      throw new NotAuthorizedError();
    }
  }
}
