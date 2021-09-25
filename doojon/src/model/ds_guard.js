import { Database } from '@google-cloud/spanner';
import { ForbiddenError } from './errors.js';
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

  static get _objectsCreateSchema() {};
  static get _whereReadSchema() {};
  static get _whatReadSchema() {};
  static get _whereUpdateSchema() {};
  static get _whatUpdateSchema() {};
  static get _whereDeleteSchema() {};

  _validateCreate;
  _validateRead;
  _validateUpdate;
  _validateDelete;

  _postInit() {
    if (this.constructor._createSchema) {
      this._validateCreate = this._validator.compile(this.constructor._createSchema);
    }
    if (this.constructor._readSchema) {
      this._validateRead = this._validator.compile(this.constructor._readSchema);
    }
    if (this.constructor._updateSchema) {
      this._validateUpdate = this._validator.compile(this.constructor._updateSchema);
    }
    if (this.constructor._deleteSchema) {
      this._validateDelete = this._validator.compile(this.constructor._deleteSchema);
    }
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
  async precreateCheck(state, objects) {
    throw new ForbiddenError('create action has been foribdden');
  }

  /**
   * Dataservices call this method of their guard to
   * ensure that read action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Object} where
   */
  async prereadCheck(state, where) {
    throw new ForbiddenError('read action has been foribdden');
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
  async preupdateCheck(state, where, fields) {
    throw new ForbiddenError('update action has been foribdden');
  }

  /**
   * Dataservices call this method of their guard to
   * ensure that delete action is allowed for user defined in state
   * by domain logic
   *
   * @param {State} state
   * @param {Object} where
   */
  async predeleteCheck(state, where) {
    throw new ForbiddenError('delete actions has been foribdden');
  }

  /**
   * Validate fields against array of fields to ensure
   * that extra fields aren't present in object.
   *
   * If options.strict is true then it also
   * checks that every field in `aganinstFields` is present
   * in `fields` param
   *
   * @param {Object} fields
   * @param {Array<String>} againstFields
   * @param {Object} options
   * @returns {undefined}
   */
  validateFields(
    fields,
    againstFields = undefined,
    options = { strict: false }
  ) {
    const allowedFields = againstFields ?? Object.keys(this._fields);

    if (Object.keys(fields).length > Object.keys(allowedFields).length)
      throw new Error('extra fields found');

    const foundFields = [];
    for (const key in fields) {
      if (!allowedFields.includes(key))
        throw new Error(`${key} is not allowed`);
      foundFields.push(key);
    }

    if (options.strict) {
      for (const needed of allowedFields) {
        if (!foundFields.includes(needed))
          throw new Error(`${needed} field not found`);
      }
    }

    return;
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
